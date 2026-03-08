import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: { user: true, schedule: { include: { train: true, destination: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
