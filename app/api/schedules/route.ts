import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const schedules = await prisma.schedule.findMany({
            include: { train: true, destination: true, _count: { select: { bookings: true } } },
            orderBy: { departureTime: 'asc' }
        });
        return NextResponse.json(schedules);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { departureTime, arrivalTime, ...rest } = body;
        const schedule = await prisma.schedule.create({
            data: {
                ...rest,
                departureTime: new Date(departureTime),
                arrivalTime: new Date(arrivalTime)
            }
        });
        return NextResponse.json(schedule, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
