'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, TrainFront, Edit2, Trash2, Hash, Users } from 'lucide-react';
import {
    getTrains,
    createTrain,
    updateTrain,
    deleteTrain
} from '@/app/actions/trains';
import TrainModal from '@/components/TrainModal';

export default function TrainsPage() {
    const [trains, setTrains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrain, setEditingTrain] = useState<any>(null);

    const fetchTrains = async () => {
        setLoading(true);
        const data = await getTrains();
        setTrains(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTrains();
    }, []);

    const filteredTrains = trains.filter(train =>
        train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (formData: any) => {
        if (editingTrain) {
            await updateTrain(editingTrain.id, formData);
        } else {
            await createTrain(formData);
        }
        fetchTrains();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this train? All linked schedules may be affected.')) {
            const result = await deleteTrain(id);
            if (!result.success) {
                alert(result.error);
            }
            fetchTrains();
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fleet Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your trains, numbers, and passenger capacities.</p>
                </div>
                <button
                    onClick={() => { setEditingTrain(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                    <Plus size={20} />
                    Add New Train
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by train name or number..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold">Checking fleet status...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrains.map((train) => (
                        <div key={train.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <TrainFront size={28} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingTrain(train); setIsModalOpen(true); }}
                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(train.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{train.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mt-1">
                                        <Hash size={14} />
                                        {train.number}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                                            <Users size={16} className="text-blue-500" />
                                            {train.capacity}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Usage</p>
                                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                                            <Hash size={16} className="text-emerald-500" />
                                            {train._count.schedules} Runs
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredTrains.length === 0 && (
                        <div className="col-span-full py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
                            <TrainFront size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest">No trains in fleet</p>
                        </div>
                    )}
                </div>
            )}

            <TrainModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingTrain}
                title={editingTrain ? 'Edit Train' : 'Add New Train'}
            />
        </div>
    );
}
