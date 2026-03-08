import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    try {
        const where: any = {};
        if (from && from !== 'all') {
            // In the real schema, we might need to match by city or station name
            // For now, let's assume filtering by origin city name for simplicity if provided
            where.origin = from;
        }
        if (to && to !== 'all') {
            where.destinationId = to;
        }

        const schedules = await prisma.schedule.findMany({
            where,
            include: {
                train: true,
                destination: true,
            }
        });
        return NextResponse.json(schedules);
    } catch (error) {
        console.error("Failed to fetch schedules:", error);
        return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
    }
}
