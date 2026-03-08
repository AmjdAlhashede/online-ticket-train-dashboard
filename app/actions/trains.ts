'use server';

import { revalidatePath } from "next/cache";

const API_BASE_URL = '/api';

export async function getTrains() {
    try {
        const res = await fetch(`${API_BASE_URL}/trains`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error("Error fetching trains:", error);
        return [];
    }
}

export async function createTrain(data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/trains`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const train = await res.json();
        revalidatePath("/trains");
        return { success: true, data: train };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}

export async function updateTrain(id: string, data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/trains/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const train = await res.json();
        revalidatePath("/trains");
        return { success: true, data: train };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}

export async function deleteTrain(id: string) {
    try {
        await fetch(`${API_BASE_URL}/trains/${id}`, { method: 'DELETE' });
        revalidatePath("/trains");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}
