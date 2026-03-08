import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { departureTime, arrivalTime, ...rest } = body;
        const schedule = await prisma.schedule.update({
            where: { id },
            data: {
                ...rest,
                departureTime: new Date(departureTime),
                arrivalTime: new Date(arrivalTime)
            }
        });
        return NextResponse.json(schedule, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.schedule.delete({ where: { id } });
        return new Response(null, { status: 204, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}
