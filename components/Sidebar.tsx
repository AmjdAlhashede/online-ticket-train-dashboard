'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    TrainFront,
    MapPin,
    CalendarDays,
    Users,
    Settings,
    LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: CalendarDays, label: 'Schedules', href: '/schedules' },
    { icon: MapPin, label: 'Destinations', href: '/destinations' },
    { icon: TrainFront, label: 'Trains', href: '/trains' },
    { icon: Users, label: 'User Management', href: '/users' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-72 bg-slate-900 h-screen sticky top-0 flex flex-col border-r border-slate-800">
            <div className="p-8">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrainFront size={20} className="text-white" />
                    </div>
                    TrackLine
                </h2>
                <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest px-1">Control Panel</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
