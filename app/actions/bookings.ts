'use server';

import prisma from "@/lib/prisma";

export async function getBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: true,
                schedule: {
                    include: { train: true, destination: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return bookings;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            include: { _count: { select: { bookings: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}
