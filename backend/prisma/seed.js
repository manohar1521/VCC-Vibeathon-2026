const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // Users
    await prisma.user.upsert({
        where: { email: 'coord@test.com' },
        update: {},
        create: { name: 'John Coord', email: 'coord@test.com', password, role: 'COORDINATOR', department: 'CSE' }
    });

    await prisma.user.upsert({
        where: { email: 'hod@test.com' },
        update: {},
        create: { name: 'Dr. Smith', email: 'hod@test.com', password, role: 'HOD', department: 'CSE' }
    });

    await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: { name: 'Admin User', email: 'admin@test.com', password, role: 'ADMIN' }
    });

    // Venues
    const venues = [
        { name: 'Main Auditorium', type: 'Auditorium', capacity: 500 },
        { name: 'Conference Hall A', type: 'Seminar Hall', capacity: 100, dept: 'CSE' },
        { name: 'Digital Library Plaza', type: 'Open Space', capacity: 200 }
    ];

    for (const v of venues) {
        await prisma.venue.create({ data: v });
    }

    // Resources
    const resources = [
        { name: 'Wireless Mics', type: 'Equipment', total: 10, available: 10 },
        { name: 'Projectors', type: 'Equipment', total: 5, available: 5 },
        { name: 'Lunch Sets', type: 'Food', total: 1000, available: 1000 }
    ];

    for (const r of resources) {
        await prisma.resource.create({ data: r });
    }

    console.log('Seed completed!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
