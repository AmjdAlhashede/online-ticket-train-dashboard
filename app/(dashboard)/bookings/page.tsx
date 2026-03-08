'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Ticket,
    Search,
    Calendar,
    Clock,
    MapPin,
    Mail,
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    CreditCard,
    Trash2
} from 'lucide-react';
import { getBookings, getUsers, deleteUser } from '@/app/actions/bookings';

export default function MonitorPage() {
    const [activeTab, setActiveTab] = useState<'bookings' | 'users'>('bookings');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        if (activeTab === 'bookings') {
            const data = await getBookings();
            setItems(data);
        } else {
            const data = await getUsers();
            setItems(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const filteredItems = items.filter(item => {
        if (!item) return false;
        if (activeTab === 'bookings') {
            const userName = (item.user?.name || item.user?.email || '').toLowerCase();
            const origin = (item.schedule?.origin || '').toLowerCase();
            const destCity = (item.schedule?.destination?.city || '').toLowerCase();
            const s = searchTerm.toLowerCase();
            return userName.includes(s) || origin.includes(s) || destCity.includes(s);
        } else {
            const userName = (item.name || '').toLowerCase();
            const userEmail = (item.email || '').toLowerCase();
            const s = searchTerm.toLowerCase();
            return userName.includes(s) || userEmail.includes(s);
        }
    });

    const formatDate = (date: any) => date ? new Date(date).toLocaleDateString() : 'N/A';

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}? All their bookings will also be deleted.`)) return;

        const res = await deleteUser(userId);
        if (res.success) {
            fetchData();
        } else {
            alert("Error deleting user");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Monitor</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time oversight of customer activity and revenue.</p>
                </div>

                <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex gap-2">
                    <button
                        onClick={() => { setActiveTab('bookings'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Ticket size={18} />
                        Bookings
                    </button>
                    <button
                        onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Users size={18} />
                        Customers
                    </button>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={20} />
                <input
                    type="text"
                    placeholder={activeTab === 'bookings' ? "Search by customer or route..." : "Search by name or email..."}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest">Scanning Database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {activeTab === 'bookings' ? (
                        filteredItems.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl transition-all group flex flex-col md:flex-row items-center gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900">{booking.user?.name || 'Unknown User'}</h4>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{booking.user?.email || 'No Email'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 flex-[2] w-full px-6 py-3 bg-slate-50 rounded-2xl">
                                    <div className="text-center md:text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</p>
                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                            {booking.schedule?.origin || 'N/A'}
                                            <ArrowRight size={14} />
                                            {booking.schedule?.destination?.city || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                        <div className="font-bold text-slate-700">{formatDate(booking.createdAt)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 shrink-0">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</p>
                                        <div className="text-xl font-black text-slate-900 flex items-center gap-1">
                                            <span className="text-xs text-slate-400">SAR</span>
                                            {booking.schedule?.price || 0}
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm">
                                        Confirmed
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredItems.map((user) => (
                            <div key={user.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl transition-all group flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl uppercase">
                                    {(user.name || user.email || 'U').charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black text-slate-900 text-lg">{user.name || 'Anonymous User'}</h4>
                                        <ShieldCheck size={18} className="text-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-sm mt-1">
                                        <div className="flex items-center gap-1">
                                            <Mail size={14} />
                                            {user.email || 'No Email'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            Joined {formatDate(user.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right px-8 py-3 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loyalty Activity</p>
                                    <div className="flex items-center gap-2 font-black text-slate-900 justify-end">
                                        <CreditCard size={16} className="text-emerald-500" />
                                        {user._count?.bookings || 0} Bookings
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete Customer"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}

                    {filteredItems.length === 0 && (
                        <div className="py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
                            <Search size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest">No matching records</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
