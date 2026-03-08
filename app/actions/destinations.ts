'use server';

import { revalidatePath } from "next/cache";

const API_BASE_URL = '/api';

export async function getDestinations() {
    try {
        const res = await fetch(`${API_BASE_URL}/destinations`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error("Error fetching destinations:", error);
        return [];
    }
}

export async function createDestination(data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/destinations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const dest = await res.json();
        revalidatePath("/destinations");
        return { success: true, data: dest };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}

export async function updateDestination(id: string, data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/destinations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const dest = await res.json();
        revalidatePath("/destinations");
        return { success: true, data: dest };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}

export async function deleteDestination(id: string) {
    try {
        await fetch(`${API_BASE_URL}/destinations/${id}`, { method: 'DELETE' });
        revalidatePath("/destinations");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}
