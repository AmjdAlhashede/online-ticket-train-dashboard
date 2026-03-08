'use server';

import { revalidatePath } from "next/cache";

const API_BASE_URL = '/api';

export async function getSchedules() {
    try {
        const res = await fetch(`${API_BASE_URL}/schedules`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error("Error fetching schedules:", error);
        return [];
    }
}

export async function createSchedule(data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const schedule = await res.json();
        revalidatePath("/schedules");
        return { success: true, data: schedule };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}

export async function updateSchedule(id: string, data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/schedules/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const schedule = await res.json();
        revalidatePath("/schedules");
        return { success: true, data: schedule };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}

export async function deleteSchedule(id: string) {
    try {
        await fetch(`${API_BASE_URL}/schedules/${id}`, { method: 'DELETE' });
        revalidatePath("/schedules");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed" };
    }
}
