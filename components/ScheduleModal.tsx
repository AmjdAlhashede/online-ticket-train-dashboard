'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, TrainFront, DollarSign } from 'lucide-react';
import { getTrains } from '@/app/actions/trains';
import { getDestinations } from '@/app/actions/destinations';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: any;
    title: string;
}

export default function ScheduleModal({ isOpen, onClose, onSave, initialData, title }: ScheduleModalProps) {
    const [formData, setFormData] = useState({
        trainId: '',
        origin: 'Riyadh Central', // Default origin as it's the main hub
        destinationId: '',
        departureTime: '',
        arrivalTime: '',
        price: 0
    });
    const [trains, setTrains] = useState<any[]>([]);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            const [tData, dData] = await Promise.all([getTrains(), getDestinations()]);
            setTrains(tData);
            setDestinations(dData);
        }
        if (isOpen) loadData();
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                trainId: initialData.trainId || '',
                origin: initialData.origin || 'Riyadh Central',
                destinationId: initialData.destinationId || '',
                departureTime: initialData.departureTime ? new Date(initialData.departureTime).toISOString().slice(0, 16) : '',
                arrivalTime: initialData.arrivalTime ? new Date(initialData.arrivalTime).toISOString().slice(0, 16) : '',
                price: initialData.price || 0
            });
        } else {
            setFormData({
                trainId: '',
                origin: 'Riyadh Central',
                destinationId: '',
                departureTime: '',
                arrivalTime: '',
                price: 0
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSave({ ...formData, price: Number(formData.price) });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Train</label>
                        <div className="relative">
                            <TrainFront className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
                                value={formData.trainId}
                                onChange={(e) => setFormData({ ...formData, trainId: e.target.value })}
                            >
                                <option value="">Choose a train...</option>
                                {trains.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.number})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Origin City</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Departure Point"
                                value={formData.origin}
                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Destination Station</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
                                value={formData.destinationId}
                                onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                            >
                                <option value="">Choose destination...</option>
                                {destinations.map(d => (
                                    <option key={d.id} value={d.id}>{d.city} - {d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Departure Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="datetime-local"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.departureTime}
                                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Arrival Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="datetime-local"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.arrivalTime}
                                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Ticket Price (SAR)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="number"
                                required
                                min="1"
                                step="0.01"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. 150.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
