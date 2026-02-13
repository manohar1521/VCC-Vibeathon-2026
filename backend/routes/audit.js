const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');

// Get all audit logs
router.get('/', authenticate, async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            include: {
                user: { select: { name: true, role: true, department: true } },
                event: { select: { title: true } }
            },
            orderBy: { timestamp: 'desc' }
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching audit logs', error: err.message });
    }
});

module.exports = router;
