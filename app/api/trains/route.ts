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
        const trains = await prisma.train.findMany({
            orderBy: { number: 'asc' },
            include: { _count: { select: { schedules: true } } }
        });
        return NextResponse.json(trains, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const train = await prisma.train.create({ data: body });
        return NextResponse.json(train, { status: 201, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}
