'use server';

import prisma from "@/lib/prisma";

export async function getBookings() {
    try {
        return await prisma.booking.findMany({
            include: {
                user: true,
                schedule: {
                    include: {
                        train: true,
                        destination: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}

export async function getUsers() {
    try {
        return await prisma.user.findMany({
            where: { role: 'USER' },
            include: {
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}
