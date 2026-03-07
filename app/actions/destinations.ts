'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDestinations() {
    try {
        return await prisma.destination.findMany({
            orderBy: { city: 'asc' },
            include: {
                _count: {
                    select: { schedules: true }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching destinations:", error);
        return [];
    }
}

export async function createDestination(data: {
    name: string;
    city: string;
    image: string;
    description: string;
}) {
    try {
        const destination = await prisma.destination.create({
            data
        });
        revalidatePath("/destinations");
        return { success: true, data: destination };
    } catch (error) {
        console.error("Error creating destination:", error);
        return { success: false, error: "Failed to create destination" };
    }
}

export async function updateDestination(id: string, data: {
    name: string;
    city: string;
    image: string;
    description: string;
}) {
    try {
        const destination = await prisma.destination.update({
            where: { id },
            data
        });
        revalidatePath("/destinations");
        return { success: true, data: destination };
    } catch (error) {
        console.error("Error updating destination:", error);
        return { success: false, error: "Failed to update destination" };
    }
}

export async function deleteDestination(id: string) {
    try {
        await prisma.destination.delete({
            where: { id }
        });
        revalidatePath("/destinations");
        return { success: true };
    } catch (error) {
        console.error("Error deleting destination:", error);
        return { success: false, error: "Failed to delete destination. It might be linked to existing schedules." };
    }
}
