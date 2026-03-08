'use server';

const API_BASE_URL = '/api';

export async function getBookings() {
    try {
        const res = await fetch(`${API_BASE_URL}/bookings`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}

export async function getUsers() {
    try {
        const res = await fetch(`${API_BASE_URL}/users`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}
