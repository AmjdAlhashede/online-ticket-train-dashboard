import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            include: { _count: { select: { bookings: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}
