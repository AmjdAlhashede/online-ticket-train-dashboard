import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        const where: any = {};
        if (from && from !== 'all') {
            where.origin = from;
        }
        if (to && to !== 'all') {
            where.destinationId = to;
        }

        const schedules = await prisma.schedule.findMany({
            where,
            include: { train: true, destination: true, _count: { select: { bookings: true } } },
            orderBy: { departureTime: 'asc' }
        });

        // Transform to match frontend expected format
        const transformed = schedules.map(s => ({
            id: s.id,
            price: s.price,
            departureTime: s.departureTime,
            arrivalTime: s.arrivalTime,
            origin: s.origin,
            destination: s.destination,
            train: {
                name: s.train.name,
                number: s.train.number,
                type: "Express",
                capacity: s.train.capacity
            },
            route: {
                originStationId: s.origin,
                destinationStationId: s.destinationId,
                originStation: { id: s.origin, name: s.origin, city: s.origin },
                destinationStation: { id: s.destination.id, name: s.destination.name, city: s.destination.city }
            },
            _count: s._count
        }));

        return NextResponse.json(transformed, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
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
        return NextResponse.json(schedule, { status: 201, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}
