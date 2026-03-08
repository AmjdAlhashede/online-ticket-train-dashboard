export const dynamic = 'force-dynamic';

import {
    Users,
    TrainFront,
    MapPin,
    DollarSign,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function DashboardHome() {
    // Fetch real stats from DB
    const [bookingsCount, trainsCount, destinationsCount, usersCount, recentBookings] = await Promise.all([
        prisma.booking.count(),
        prisma.train.count(),
        prisma.destination.count(),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.booking.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                schedule: { include: { destination: true } }
            }
        })
    ]);

    const stats = [
        { label: 'Total Bookings', value: bookingsCount.toString(), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Live' },
        { label: 'Active Customers', value: usersCount.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Live' },
        { label: 'Available Trains', value: trainsCount.toString(), icon: TrainFront, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Stable' },
        { label: 'Active Destinations', value: destinationsCount.toString(), icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Global' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Monitor your train network performance in real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                    </div>
                    <div className="space-y-6">
                        {recentBookings.length > 0 ? recentBookings.map((booking, i) => (
                            <div key={booking.id} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                    {booking.user.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Booking: {booking.schedule.origin} → {booking.schedule.destination.city}</p>
                                    <p className="text-xs text-slate-500 font-medium">Passenger: {booking.user.name} • Seat {booking.seatNumber || 'N/A'}</p>
                                </div>
                                <span className="text-xs font-bold text-slate-400">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-400 text-center py-4">No bookings yet</p>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-200 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <TrendingUp size={48} className="text-blue-200 mb-6" />
                        <h3 className="text-2xl font-black mb-2">Network Expansion</h3>
                        <p className="text-blue-100 font-medium leading-relaxed opacity-90 max-w-sm">
                            Your train network currently has {trainsCount} trains serving {destinationsCount} destinations with {bookingsCount} total bookings.
                        </p>
                    </div>
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-20"></div>
                </div>
            </div>
        </div>
    );
}
