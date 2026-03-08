'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Trash2 } from 'lucide-react';

interface DestinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: any;
    title: string;
}

export default function DestinationModal({ isOpen, onClose, onSave, initialData, title }: DestinationModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB Limit for Base64 (to avoid DB bloat)
                alert("File is too large. Please select an image under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
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

                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Station Image</label>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600 font-medium"
                            >
                                <Upload size={18} />
                                Upload File
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <LinkIcon size={16} />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="Or paste image URL here..."
                                value={formData.image.startsWith('data:') ? '' : formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                    </div>

                    {formData.image && (
                        <div className="w-full h-40 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 relative group">
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: '' })}
                                    className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center -z-10 text-[10px] text-slate-400">
                                <ImageIcon size={24} className="opacity-20" />
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
