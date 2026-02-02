
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Builder } from '../../types';
import { Save, ArrowLeft } from 'lucide-react';
import ImageUpload from '../../components/Admin/ImageUpload';

const BuilderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { builders, addBuilder, updateBuilder } = useData();
    const isEditing = !!id;

    const initialFormState: Builder = {
        id: '',
        name: '',
        slug: '',
        logo: '',
        description: '',
        establishedYear: new Date().getFullYear(),
        totalProjects: 0,
        ongoingProjects: 0,
        heroImage: '',
        locations: [], // string array
        // Phase 4: Trust Score
        experience: 0,
        trustScore: 0,
        isVerified: false,
        mobile: ''
    };

    const [formData, setFormData] = useState<Builder>(initialFormState);
    const [locationInput, setLocationInput] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            const builder = builders.find(b => b.id === id);
            if (builder) {
                setFormData(builder);
            }
        } else {
            setFormData(prev => ({ ...prev, id: `b${Date.now()}` }));
        }
    }, [id, isEditing, builders]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && id) {
            updateBuilder(id, formData);
        } else {
            addBuilder(formData);
        }
        navigate('/admin/builders');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        const name = e.target.name;

        // Specialized handling to avoid type mismatches if generic logic fails
        if (name === 'isVerified') {
            // Handled inline in the JSX for boolean, but good to have safety here
            setFormData(prev => ({ ...prev, isVerified: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const addLocation = () => {
        if (locationInput) {
            setFormData(prev => ({ ...prev, locations: [...prev.locations, locationInput] }));
            setLocationInput('');
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Builder' : 'Add New Builder'}>
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate('/admin/builders')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Builders
                </button>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Builder Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Slug (URL)</label>
                            <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Established Year</label>
                            <input type="number" name="establishedYear" value={formData.establishedYear} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Total Projects</label>
                            <input type="number" name="totalProjects" value={formData.totalProjects} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Active Projects</label>
                            <input type="number" name="ongoingProjects" value={formData.ongoingProjects} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <ImageUpload
                                label="Builder Logo"
                                value={formData.logo}
                                onChange={(val) => setFormData(prev => ({ ...prev, logo: val }))}
                                placeholder="Upload Logo"
                                bucket="website-assets"
                            />
                        </div>
                        <div>
                            <ImageUpload
                                label="Builder Hero Image"
                                value={formData.heroImage}
                                onChange={(val) => setFormData(prev => ({ ...prev, heroImage: val }))}
                                placeholder="Upload Hero Image"
                                bucket="website-assets"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-lg" />
                    </div>

                    {/* Phase 4: Trust Score & Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div>
                            <label className="block text-sm font-bold text-blue-900 mb-2">Experience (Years)</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-2 border border-blue-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-blue-900 mb-2">Trust Score (1-10)</label>
                            <input type="number" name="trustScore" value={formData.trustScore} onChange={handleChange} min="0" max="10" step="0.1" className="w-full px-4 py-2 border border-blue-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-blue-900 mb-2">Mobile Number</label>
                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91..." className="w-full px-4 py-2 border border-blue-200 rounded-lg" />
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isVerified"
                                    checked={formData.isVerified}
                                    onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="font-bold text-blue-900">Verified Builder</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Operating Locations</label>
                        <div className="flex gap-2 mb-2">
                            <input value={locationInput} onChange={e => setLocationInput(e.target.value)} placeholder="Add Location (e.g. Pune)" className="flex-1 px-4 py-2 border rounded-lg" />
                            <button type="button" onClick={addLocation} className="bg-slate-100 px-4 py-2 rounded-lg">Add</button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {formData.locations.map((loc, i) => (
                                <span key={i} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm">{loc}</span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-colors">
                            <Save className="w-5 h-5" />
                            Save Builder
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
};

export default BuilderForm;
