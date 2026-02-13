const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const venueRoutes = require('./routes/venues');
const resourceRoutes = require('./routes/resources');
const auditRoutes = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root / Health Check (Crucial for Vercel/Render health monitoring)
app.get('/', (req, res) => {
    res.json({
        status: 'Institutional Kernel Active',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/audit', auditRoutes);

// Start server if not running as a Vercel function
if (require.main === module || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`[SYSTEM] Server prioritized on port ${PORT}`);
    });
}

module.exports = app;
