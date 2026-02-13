const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
    try {
        const venues = await prisma.venue.findMany();
        // Logic to enrich with current occupancy if needed
        res.json(venues);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching venues' });
    }
});

router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const venue = await prisma.venue.create({ data: req.body });
        res.status(201).json(venue);
    } catch (err) {
        res.status(400).json({ message: 'Error creating venue' });
    }
});

module.exports = router;
