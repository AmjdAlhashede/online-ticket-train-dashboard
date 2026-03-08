'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DestinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: any;
    title: string;
}

export default function DestinationModal({ isOpen, onClose, onSave, initialData, title }: DestinationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        image: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                city: initialData.city || '',
                image: initialData.image || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({ name: '', city: '', image: '', description: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1541480601022-2308c0f0ce13?auto=format&fit=crop&q=80&w=2000";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Use default image if field is empty
        const submissionData = {
            ...formData,
            image: formData.image.trim() || DEFAULT_IMAGE
        };
        await onSave(submissionData);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Station Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Riyadh Central"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Riyadh"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Link to image (Unsplash, etc.)"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                        <p className="text-[11px] text-slate-500 mt-1">Leave blank to use a default premium train image.</p>
                    </div>

                    {formData.image && (
                        <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-100 overflow-hidden bg-slate-50 relative group">
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 pointer-events-none">
                                Image Preview
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Brief description of the destination..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
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
                            {loading ? 'Saving...' : 'Save Destination'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
