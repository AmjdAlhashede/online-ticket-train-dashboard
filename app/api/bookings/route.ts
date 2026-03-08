import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
        const bookings = await prisma.booking.findMany({
            include: { user: true, schedule: { include: { train: true, destination: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(bookings, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(req: Request) {
    try {
        const { scheduleId, name, email } = await req.json();

        if (!scheduleId || !name || !email) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400, headers: corsHeaders });
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash('default123', 10);
            user = await prisma.user.create({
                data: { name, email, password: hashedPassword, role: 'USER' }
            });
        }

        // Generate random seat
        const seats = ['1A', '2B', '3C', '14D', '22A', '8C', '12B', '15F', '9E', '5A', '7B', '11C', '18D', '20A'];
        const randomSeat = seats[Math.floor(Math.random() * seats.length)];

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                scheduleId,
                seatNumber: randomSeat,
                status: 'CONFIRMED'
            }
        });

        return NextResponse.json({
            success: true,
            bookingId: booking.id,
            seat: randomSeat
        }, { status: 201, headers: corsHeaders });
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500, headers: corsHeaders });
    }
}
