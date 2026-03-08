'use server';

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getDestinations() {
    try {
        const destinations = await prisma.destination.findMany({
            orderBy: { city: 'asc' },
            include: { _count: { select: { schedules: true } } }
        });
        return destinations;
    } catch (error) {
        console.error("Error fetching destinations:", error);
        return [];
    }
}

export async function createDestination(data: { name: string; city: string; image: string; description: string }) {
    try {
        const dest = await prisma.destination.create({ data });
        revalidatePath("/destinations");
        return { success: true, data: dest };
    } catch (error) {
        console.error("Error creating destination:", error);
        return { success: false, error: "Failed to create destination" };
    }
}

export async function updateDestination(id: string, data: { name?: string; city?: string; image?: string; description?: string }) {
    try {
        const dest = await prisma.destination.update({
            where: { id },
            data
        });
        revalidatePath("/destinations");
        return { success: true, data: dest };
    } catch (error) {
        console.error("Error updating destination:", error);
        return { success: false, error: "Failed to update destination" };
    }
}

export async function deleteDestination(id: string) {
    try {
        await prisma.destination.delete({ where: { id } });
        revalidatePath("/destinations");
        return { success: true };
    } catch (error) {
        console.error("Error deleting destination:", error);
        return { success: false, error: "Failed to delete destination. It may have linked schedules." };
    }
}
