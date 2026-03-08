import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const destinations = await prisma.destination.findMany();
        return NextResponse.json(destinations);
    } catch (error) {
        console.error("Failed to fetch destinations:", error);
        return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
    }
}
