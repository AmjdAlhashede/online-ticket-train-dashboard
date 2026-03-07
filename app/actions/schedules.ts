'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSchedules() {
    try {
        return await prisma.schedule.findMany({
            include: {
                train: true,
                destination: true,
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { departureTime: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching schedules:", error);
        return [];
    }
}

export async function createSchedule(data: {
    trainId: string;
    origin: string;
    destinationId: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
}) {
    try {
        const schedule = await prisma.schedule.create({
            data: {
                trainId: data.trainId,
                origin: data.origin,
                destinationId: data.destinationId,
                departureTime: new Date(data.departureTime),
                arrivalTime: new Date(data.arrivalTime),
                price: data.price
            }
        });
        revalidatePath("/schedules");
        return { success: true, data: schedule };
    } catch (error) {
        console.error("Error creating schedule:", error);
        return { success: false, error: "Failed to create schedule" };
    }
}

export async function updateSchedule(id: string, data: {
    trainId: string;
    origin: string;
    destinationId: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
}) {
    try {
        const schedule = await prisma.schedule.update({
            where: { id },
            data: {
                trainId: data.trainId,
                origin: data.origin,
                destinationId: data.destinationId,
                departureTime: new Date(data.departureTime),
                arrivalTime: new Date(data.arrivalTime),
                price: data.price
            }
        });
        revalidatePath("/schedules");
        return { success: true, data: schedule };
    } catch (error) {
        console.error("Error updating schedule:", error);
        return { success: false, error: "Failed to update schedule" };
    }
}

export async function deleteSchedule(id: string) {
    try {
        await prisma.schedule.delete({
            where: { id }
        });
        revalidatePath("/schedules");
        return { success: true };
    } catch (error) {
        console.error("Error deleting schedule:", error);
        return { success: false, error: "Failed to delete schedule. It may have linked bookings." };
    }
}
