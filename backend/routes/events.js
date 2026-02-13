const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, authorize } = require('../middleware/auth');

// Create event
router.post('/', authenticate, async (req, res) => {
    const { title, description, date, duration, participants, venueId, venueName, resources } = req.body;

    try {
        // Conflict check (simplified)
        const conflict = await prisma.event.findFirst({
            where: { venueId, date, status: { notIn: ['REJECTED', 'COMPLETED'] } }
        });
        if (conflict) return res.status(409).json({ message: 'Venue already booked for this date' });

        const event = await prisma.event.create({
            data: {
                title, description, date, duration, participants, venueId, venueName,
                status: 'PENDING_HOD',
                department: req.user.department || 'GENERAL',
                coordinatorId: req.user.id,
                resources: {
                    create: resources.map(r => ({ resourceId: r.id, quantity: r.quantity || 1 }))
                },
                timeline: {
                    create: { action: 'SUBMITTED', note: 'Initial request submitted', userId: req.user.id }
                }
            }
        });

        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: 'Error creating event', error: err.message });
    }
});

// Get events based on role
router.get('/', authenticate, async (req, res) => {
    try {
        let events;
        const { role, department, id } = req.user;

        if (role === 'COORDINATOR') {
            events = await prisma.event.findMany({ where: { coordinatorId: id }, include: { resources: true, timeline: true } });
        } else if (role === 'HOD') {
            events = await prisma.event.findMany({ where: { department }, include: { resources: true, timeline: true } });
        } else {
            events = await prisma.event.findMany({ include: { resources: true, timeline: true } });
        }
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Update event status (Approval workflow)
router.patch('/:id/status', authenticate, async (req, res) => {
    const { status, note, reason } = req.body;
    try {
        const event = await prisma.event.update({
            where: { id: req.params.id },
            data: {
                status,
                rejectionReason: reason || null,
                timeline: {
                    create: { action: 'STATUS_UPDATE', note, reason, userId: req.user.id }
                }
            }
        });

        // Handle resource release if completed or rejected
        if (status === 'COMPLETED' || status === 'REJECTED') {
            const allocations = await prisma.allocation.findMany({ where: { eventId: req.params.id } });
            for (const alloc of allocations) {
                await prisma.resource.update({
                    where: { id: alloc.resourceId },
                    data: { available: { increment: alloc.quantity } }
                });
            }
            // Also release venue if venue state was tracked specifically
        }

        res.json(event);
    } catch (err) {
        res.status(400).json({ message: 'Error updating event' });
    }
});

module.exports = router;
