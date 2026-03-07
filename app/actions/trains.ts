'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTrains() {
    try {
        return await prisma.train.findMany({
            orderBy: { number: 'asc' },
            include: {
                _count: {
                    select: { schedules: true }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching trains:", error);
        return [];
    }
}

export async function createTrain(data: {
    name: string;
    number: string;
    capacity: number;
}) {
    try {
        const train = await prisma.train.create({
            data
        });
        revalidatePath("/trains");
        return { success: true, data: train };
    } catch (error) {
        console.error("Error creating train:", error);
        return { success: false, error: "Failed to create train. Ensure the train number is unique." };
    }
}

export async function updateTrain(id: string, data: {
    name: string;
    number: string;
    capacity: number;
}) {
    try {
        const train = await prisma.train.update({
            where: { id },
            data
        });
        revalidatePath("/trains");
        return { success: true, data: train };
    } catch (error) {
        console.error("Error updating train:", error);
        return { success: false, error: "Failed to update train" };
    }
}

export async function deleteTrain(id: string) {
    try {
        await prisma.train.delete({
            where: { id }
        });
        revalidatePath("/trains");
        return { success: true };
    } catch (error) {
        console.error("Error deleting train:", error);
        return { success: false, error: "Failed to delete train. It might be assigned to active schedules." };
    }
}
