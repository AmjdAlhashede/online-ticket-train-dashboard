'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Edit2, Trash2, ExternalLink } from 'lucide-react';
import {
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination
} from '@/app/actions/destinations';
import DestinationModal from '@/components/DestinationModal';

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDest, setEditingDest] = useState<any>(null);

    const fetchDestinations = async () => {
        setLoading(true);
        const data = await getDestinations();
        setDestinations(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    const filteredDestinations = destinations.filter(dest =>
        dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (formData: any) => {
        if (editingDest) {
            await updateDestination(editingDest.id, formData);
        } else {
            await createDestination(formData);
        }
        fetchDestinations();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this destination? This cannot be undone.')) {
            const result = await deleteDestination(id);
            if (!result.success) {
                alert(result.error);
            }
            fetchDestinations();
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Destinations Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage station locations and regional hubs.</p>
                </div>
                <button
                    onClick={() => { setEditingDest(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                    <Plus size={20} />
                    Add Destination
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by city or station name..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold">Loading destinations...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDestinations.map((dest) => (
                        <div key={dest.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
                            <div className="h-48 relative overflow-hidden">
                                <img src={dest.image} alt={dest.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => { setEditingDest(dest); setIsModalOpen(true); }}
                                        className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-slate-700 hover:text-blue-600 shadow-lg transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dest.id)}
                                        className="p-2.5 bg-white/90 backdrop-blur rounded-xl text-slate-700 hover:text-red-600 shadow-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1.5 bg-blue-600 text-white text-xs font-black rounded-lg shadow-lg uppercase tracking-wider">
                                        {dest._count.schedules} Schedules
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
                                    <MapPin size={16} />
                                    {dest.city}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{dest.name}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">
                                    {dest.description}
                                </p>
                                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {dest.id.substring(0, 8)}...</span>
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredDestinations.length === 0 && (
                        <div className="col-span-full py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
                            <MapPin size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest">No destinations found</p>
                        </div>
                    )}
                </div>
            )}

            <DestinationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingDest}
                title={editingDest ? 'Edit Destination' : 'Add New Destination'}
            />
        </div>
    );
}
