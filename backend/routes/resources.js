const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
    try {
        const resources = await prisma.resource.findMany();
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching resources' });
    }
});

router.patch('/:id/reset', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
        await prisma.resource.update({
            where: { id: req.params.id },
            data: { available: resource.total }
        });
        res.json({ message: 'Resource reset successful' });
    } catch (err) {
        res.status(400).json({ message: 'Error resetting resource' });
    }
});

module.exports = router;
