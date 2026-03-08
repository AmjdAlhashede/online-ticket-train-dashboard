import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
        return NextResponse.json(schedule);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.schedule.delete({ where: { id } });
        return new Response(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
