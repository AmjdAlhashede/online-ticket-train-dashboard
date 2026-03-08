import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const stations = await prisma.destination.findMany({
            select: {
                id: true,
                name: true,
                city: true,
            }
        });
        return NextResponse.json(stations);
    } catch (error) {
        console.error("Failed to fetch stations:", error);
        return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
    }
}
