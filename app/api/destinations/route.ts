import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
    try {
        const destinations = await prisma.destination.findMany({
            orderBy: { city: 'asc' },
            include: { _count: { select: { schedules: true } } }
        });
        return NextResponse.json(destinations, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const dest = await prisma.destination.create({ data: body });
        return NextResponse.json(dest, { status: 201, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}
