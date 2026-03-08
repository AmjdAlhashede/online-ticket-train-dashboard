import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const trains = await prisma.train.findMany({
            orderBy: { number: 'asc' },
            include: { _count: { select: { schedules: true } } }
        });
        return NextResponse.json(trains);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const train = await prisma.train.create({ data: body });
        return NextResponse.json(train, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
