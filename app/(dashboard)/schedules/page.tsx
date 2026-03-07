'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, MapPin, TrainFront, Edit2, Trash2, ArrowRight, DollarSign } from 'lucide-react';
import {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from '@/app/actions/schedules';
import ScheduleModal from '@/components/ScheduleModal';

export default function SchedulesPage() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<any>(null);

    const fetchSchedules = async () => {
        setLoading(true);
        const data = await getSchedules();
        setSchedules(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const filteredSchedules = schedules.filter(sch =>
        sch.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sch.destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sch.train.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (formData: any) => {
        if (editingSchedule) {
            await updateSchedule(editingSchedule.id, formData);
        } else {
            await createSchedule(formData);
        }
        fetchSchedules();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this schedule? This will affect current bookings.')) {
            const result = await deleteSchedule(id);
            if (!result.success) {
                alert(result.error);
            }
            fetchSchedules();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Schedules Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Plan and manage train journeys and ticket pricing.</p>
                </div>
                <button
                    onClick={() => { setEditingSchedule(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                    <Plus size={20} />
                    Create Schedule
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by origin, destination, or train..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold">Synchronizing timetables...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSchedules.map((sch) => (
                        <div key={sch.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group p-6 flex flex-col lg:flex-row items-center gap-8">
                            {/* Journey Details */}
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</span>
                                    <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                                        <MapPin size={18} className="text-blue-500" />
                                        {sch.origin}
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-tighter">{formatTime(sch.departureTime)}</span>
                                </div>

                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="flex items-center gap-4 w-full px-4">
                                        <div className="h-0.5 bg-slate-100 flex-1"></div>
                                        <ArrowRight size={20} className="text-slate-200" />
                                        <div className="h-0.5 bg-slate-100 flex-1"></div>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">{formatDate(sch.departureTime)}</span>
                                </div>

                                <div className="flex flex-col items-center md:items-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</span>
                                    <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                                        {sch.destination.city}
                                        <MapPin size={18} className="text-blue-500" />
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-tighter">{formatTime(sch.arrivalTime)}</span>
                                </div>
                            </div>

                            {/* Asset & Booking Info */}
                            <div className="lg:w-48 w-full py-4 lg:py-0 px-6 lg:px-8 lg:border-l lg:border-r border-slate-50 flex flex-col items-center justify-center space-y-3">
                                <div className="flex items-center gap-2 text-slate-600 font-bold bg-slate-50 px-3 py-1.5 rounded-xl w-full justify-center">
                                    <TrainFront size={16} />
                                    {sch.train.number}
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    {sch._count.bookings} Bookings
                                </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="lg:w-48 w-full flex items-center justify-between lg:justify-center gap-4">
                                <div className="text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ticket</span>
                                    <div className="text-2xl font-black text-slate-900 flex items-center">
                                        <span className="text-sm font-bold text-slate-400 mr-0.5">SAR</span>
                                        {sch.price}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingSchedule(sch); setIsModalOpen(true); }}
                                        className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sch.id)}
                                        className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredSchedules.length === 0 && (
                        <div className="py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
                            <Calendar size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest">No schedules found</p>
                        </div>
                    )}
                </div>
            )}

            <ScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingSchedule}
                title={editingSchedule ? 'Edit Schedule' : 'Create New Journey'}
            />
        </div>
    );
}
