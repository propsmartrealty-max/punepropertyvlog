
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { Save, ArrowLeft, Trash2, Plus, Wand2, Loader2, Search } from 'lucide-react';
import { fetchProjectDetailsFromAI } from '../../services/aiService';
import ImageUpload from '../../components/Admin/ImageUpload';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, builders, localities, addProject, updateProject } = useData();
    const isEditing = !!id;

    const initialFormState: Project = {
        id: '',
        title: '',
        slug: '',
        builderId: '',
        location: '',
        priceRange: '',
        configurations: [], // string array
        status: 'New Launch',
        possessionDate: '',
        image: '',
        type: 'Residential',
        description: '',
        reraId: '',
        exactPrice: '',
        metaDescription: '',
        seoKeywords: [],
        features: [], // string array
        specs: [],
        pricePerSqft: undefined
    };

    const [formData, setFormData] = useState<Project>(initialFormState);
    const [configInput, setConfigInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [specInput, setSpecInput] = useState({ label: '', value: '' });

    // AI Auto-Fetch State
    const [aiQuery, setAiQuery] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            const project = projects.find(p => p.id === id);
            if (project) {
                setFormData(project);
                setAiQuery(project.title); // Pre-fill query for editing
            }
        } else {
            // Generate a random ID for new projects
            setFormData(prev => ({ ...prev, id: `p${Date.now()}` }));
        }
    }, [id, isEditing, projects]);

    const handleAiFetch = async () => {
        if (!aiQuery.trim()) {
            setAiError('Please enter a project name or link.');
            return;
        }
        setIsAiLoading(true);
        setAiError('');

        try {
            console.log("Invoking AI service for:", aiQuery);
            const data = await fetchProjectDetailsFromAI(aiQuery);
            console.log("Received AI data:", data);

            // Merge AI data with current form data
            setFormData(prev => ({
                ...prev,
                title: data.title || prev.title,
                location: data.location || prev.location,
                priceRange: data.priceRange || prev.priceRange,
                configurations: data.configurations?.length ? data.configurations : prev.configurations,
                status: (data.status as any) || prev.status,
                possessionDate: data.possessionDate || prev.possessionDate,
                description: data.description || prev.description,
                reraId: data.reraId || prev.reraId,
                exactPrice: data.exactPrice || prev.exactPrice,
                metaDescription: data.metaDescription || prev.metaDescription,
                seoKeywords: data.seoKeywords || prev.seoKeywords,
                features: data.features?.length ? data.features : prev.features,
                slug: data.slug || prev.slug,
                // Phase 2: AI Pricing & RERA
                advancedConfigurations: (data as any).advancedConfigurations || prev.advancedConfigurations
            }));

            // Try to match builder if name matches roughly (basic logic)
            if (data.builderId) {
                // In a real app we'd fuzzy match, here we just check if any builder name contains the AI string or vice-versa
                // Strict match first, then partial
                const matchedBuilder = builders.find(b =>
                    b.name.toLowerCase() === data.builderId!.toLowerCase() ||
                    b.name.toLowerCase().includes(data.builderId!.toLowerCase())
                );

                if (matchedBuilder) {
                    setFormData(prev => ({ ...prev, builderId: matchedBuilder.id }));
                } else {
                    // If no match, we could alert or better, show it in UI
                    console.log("Builder not found:", data.builderId);
                    // We'll set a temporary "suggestion" state (need to add to component state first)
                    // For now, let's just alert the user or use a toast if available
                    // Or better, set it in the form description temporarily so they see it? No.
                    // Let's add a "suggestedBuilder" logic.
                }
            }


        } catch (err: any) {
            console.error("Component Catch Block:", err);
            setAiError(err.message || 'Failed to fetch details.');
            alert(`Error fetching details: ${err.message}`); // Temporary alert to help user debug
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && id) {
            updateProject(id, formData);
        } else {
            addProject(formData);
        }
        navigate('/admin/projects');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let newFormData = { ...formData, [name]: value };

        // Auto-generate SEO-friendly slug
        if (name === 'title' || name === 'location') {
            // Only auto-update slug if it's empty OR if it looks like an auto-generated one (to avoid overwriting custom slugs)
            const currentSlug = formData.slug;
            const isAutoGenerated = !currentSlug || currentSlug.includes(formData.title.toLowerCase().replace(/ /g, '-'));

            if (isAutoGenerated) {
                const titlePart = (name === 'title' ? value : formData.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                const locationPart = (name === 'location' ? value : formData.location).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                if (titlePart) {
                    newFormData.slug = `${titlePart}-${locationPart ? locationPart + '-' : ''}pune`;
                }
            }
        }

        setFormData(newFormData);
    };

    // Helper handling for array inputs would go here (simplified for this plan)
    const addConfig = () => {
        if (configInput) {
            setFormData(prev => ({ ...prev, configurations: [...prev.configurations, configInput] }));
            setConfigInput('');
        }
    };

    const removeConfig = (index: number) => {
        setFormData(prev => ({
            ...prev,
            configurations: prev.configurations.filter((_, i) => i !== index)
        }));
    };

    const addFeature = () => {
        if (featureInput) {
            setFormData(prev => ({ ...prev, features: [...prev.features, featureInput] }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const addSpec = () => {
        if (specInput.label && specInput.value) {
            setFormData(prev => ({ ...prev, specs: [...prev.specs, specInput] }));
            setSpecInput({ label: '', value: '' });
        }
    };

    const removeSpec = (index: number) => {
        setFormData(prev => ({
            ...prev,
            specs: prev.specs.filter((_, i) => i !== index)
        }));
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Project' : 'Add New Project'}>
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate('/admin/projects')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </button>

                {/* AI Auto-Fetch Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Wand2 className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900">Auto-Fill with AI</h3>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                placeholder="Enter Project Name or Link (e.g. Godrej Rivergreens)"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAiFetch())}
                            />
                        </div>
                        <button
                            onClick={handleAiFetch}
                            disabled={isAiLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch Details'}
                        </button>
                    </div>
                    {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
                    <p className="text-xs text-slate-500 mt-2">
                        Powered by Gemini. Enter a project name and we'll search the web for details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Slug (URL)</label>
                            <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Builder</label>
                            <select name="builderId" value={formData.builderId} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                                <option value="">Select Builder</option>
                                {builders.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                            <div className="flex gap-2">
                                <select name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                                    <option value="">Select Locality</option>
                                    {localities.map(l => (
                                        <option key={l.id} value={l.name}>{l.name}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => navigate('/admin/localities')} title="Manage Localities" className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg">
                                    <Wand2 className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
                            <select name="type" value={formData.type || 'Residential'} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Plot">Plot</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
                            <input name="priceRange" value={formData.priceRange} onChange={handleChange} placeholder="e.g. ₹50L - ₹1Cr" required className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                                <option>New Launch</option>
                                <option>Under Construction</option>
                                <option>Ready to Move</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Possession Date</label>
                            <input name="possessionDate" value={formData.possessionDate} onChange={handleChange} placeholder="e.g. Dec 2026" className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="space-y-6 border-b border-gray-100 pb-6">
                        <h3 className="text-lg font-medium text-slate-800">Project Images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUpload
                                label="Thumbnail / Card Image"
                                value={formData.image}
                                onChange={(val) => setFormData(prev => ({ ...prev, image: val }))}
                                placeholder="Upload Card Image"
                                bucket="project-images"
                            />
                            <ImageUpload
                                label="Hero / Banner Image"
                                value={formData.heroImage}
                                onChange={(val) => setFormData(prev => ({ ...prev, heroImage: val }))}
                                placeholder="Upload Banner Image"
                                bucket="project-images"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUpload
                                label="Master Layout"
                                value={formData.masterLayout}
                                onChange={(val) => setFormData(prev => ({ ...prev, masterLayout: val }))}
                                placeholder="Upload Master Layout"
                                bucket="project-images"
                            />
                            {/* Placeholder for future logo if needed */}
                        </div>
                    </div>

                    {/* Floor Plans Section */}
                    <div className="space-y-4 border-b border-gray-100 pb-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-slate-800">Floor Plans</h3>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, floorPlans: [...(prev.floorPlans || []), ''] }))}
                                className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                + Add Floor Plan
                            </button>
                        </div>

                        {(formData.floorPlans || []).length === 0 && (
                            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm">No floor plans added yet.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {(formData.floorPlans || []).map((fp, i) => (
                                <div key={i} className="relative">
                                    <ImageUpload
                                        label={`Floor Plan ${i + 1}`}
                                        value={fp}
                                        onChange={(val) => {
                                            const newPlans = [...(formData.floorPlans || [])];
                                            newPlans[i] = val;
                                            setFormData(prev => ({ ...prev, floorPlans: newPlans }));
                                        }}
                                        onRemove={() => {
                                            const newPlans = (formData.floorPlans || []).filter((_, idx) => idx !== i);
                                            setFormData(prev => ({ ...prev, floorPlans: newPlans }));
                                        }}
                                        bucket="project-images"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-lg" />
                    </div>

                    {/* Quick Config Input (Simplified) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Configurations</label>
                        <div className="flex gap-2 mb-2">
                            <input value={configInput} onChange={e => setConfigInput(e.target.value)} placeholder="Add Config (e.g. 2 BHK)" className="flex-1 px-4 py-2 border rounded-lg" />
                            <button type="button" onClick={addConfig} className="bg-slate-100 px-4 py-2 rounded-lg">Add</button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {formData.configurations.map((c, i) => (
                                <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {c}
                                    <button type="button" onClick={() => removeConfig(i)} className="hover:text-blue-900">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Features & Amenities</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={featureInput}
                                onChange={e => setFeatureInput(e.target.value)}
                                placeholder="Add Feature (e.g. Swimming Pool)"
                                className="flex-1 px-4 py-2 border rounded-lg"
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            />
                            <button type="button" onClick={addFeature} className="bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {formData.features.map((f, i) => (
                                <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {f}
                                    <button type="button" onClick={() => removeFeature(i)} className="hover:text-emerald-900">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>


                    {/* RERA and Verification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div>
                            <label className="block text-sm font-bold text-yellow-900 mb-2">Price Per Sq.Ft (Base)</label>
                            <input
                                type="number"
                                name="pricePerSqft"
                                value={formData.pricePerSqft || ''}
                                onChange={handleChange}
                                placeholder="e.g. 8500"
                                className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                            />
                            <p className="text-xs text-yellow-800 mt-1">Used for "Deal Meter" calculation</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-yellow-900 mb-2">RERA ID</label>
                            <input name="reraId" value={formData.reraId || ''} onChange={handleChange} placeholder="e.g. P52100012345" className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-yellow-900 mb-2">Verification Status</label>
                            <select name="verificationStatus" value={formData.verificationStatus || 'Pending'} onChange={handleChange} className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500">
                                <option value="Pending">Pending</option>
                                <option value="Verified">Verified</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Configurations (Pricing Engine) - Phase 2 */}
                    <div className="border border-blue-100 rounded-xl overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-blue-900">Unit Configurations (Pricing Engine)</h3>
                                <p className="text-xs text-blue-700">Add detailed units for real-time cost calculation.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const newConfig = {
                                        id: crypto.randomUUID(),
                                        projectId: formData.id,
                                        name: '2 BHK Premium',
                                        carpetArea: 0,
                                        balconyArea: 0,
                                        bathrooms: 2,
                                        basePrice: 0,
                                        infraCharges: 0,
                                        clubhouseCharges: 0,
                                        gstRate: 5,
                                        stampDutyRate: 7,
                                        registrationCharges: 30000
                                    } as any; // Cast to avoid partial type issues temporarily
                                    setFormData(prev => ({
                                        ...prev,
                                        advancedConfigurations: [...(prev.advancedConfigurations || []), newConfig]
                                    }));
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Unit
                            </button>
                        </div>

                        <div className="p-4 space-y-4 bg-slate-50">
                            {(formData.advancedConfigurations || []).length === 0 && (
                                <p className="text-center text-slate-400 text-sm py-4">No detailed configurations added yet.</p>
                            )}
                            {(formData.advancedConfigurations || []).map((config, i) => (
                                <div key={config.id || i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newConfigs = [...(formData.advancedConfigurations || [])];
                                            newConfigs.splice(i, 1);
                                            setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                        }}
                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Unit Name</label>
                                            <input
                                                value={config.name}
                                                onChange={e => {
                                                    const newConfigs = [...(formData.advancedConfigurations || [])];
                                                    newConfigs[i] = { ...newConfigs[i], name: e.target.value };
                                                    setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                                }}
                                                className="w-full px-3 py-1.5 border rounded" placeholder="e.g. 3 BHK Luxury"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Carpet Area (sq.ft)</label>
                                            <input
                                                type="number"
                                                value={config.carpetArea}
                                                onChange={e => {
                                                    const newConfigs = [...(formData.advancedConfigurations || [])];
                                                    newConfigs[i] = { ...newConfigs[i], carpetArea: Number(e.target.value) };
                                                    setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                                }}
                                                className="w-full px-3 py-1.5 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Base Price (₹)</label>
                                            <input
                                                type="number"
                                                value={config.basePrice}
                                                onChange={e => {
                                                    const newConfigs = [...(formData.advancedConfigurations || [])];
                                                    newConfigs[i] = { ...newConfigs[i], basePrice: Number(e.target.value) };
                                                    setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                                }}
                                                className="w-full px-3 py-1.5 border rounded"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <label className="text-xs text-slate-500">Infra Charges</label>
                                            <input type="number" value={config.infraCharges} onChange={e => {
                                                const newConfigs = [...(formData.advancedConfigurations || [])];
                                                newConfigs[i] = { ...newConfigs[i], infraCharges: Number(e.target.value) };
                                                setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                            }} className="w-full px-2 py-1 border rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500">Clubhouse</label>
                                            <input type="number" value={config.clubhouseCharges} onChange={e => {
                                                const newConfigs = [...(formData.advancedConfigurations || [])];
                                                newConfigs[i] = { ...newConfigs[i], clubhouseCharges: Number(e.target.value) };
                                                setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                            }} className="w-full px-2 py-1 border rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500">Stamp Duty (%)</label>
                                            <input type="number" value={config.stampDutyRate} onChange={e => {
                                                const newConfigs = [...(formData.advancedConfigurations || [])];
                                                newConfigs[i] = { ...newConfigs[i], stampDutyRate: Number(e.target.value) };
                                                setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                            }} className="w-full px-2 py-1 border rounded text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500">GST (%)</label>
                                            <input type="number" value={config.gstRate} onChange={e => {
                                                const newConfigs = [...(formData.advancedConfigurations || [])];
                                                newConfigs[i] = { ...newConfigs[i], gstRate: Number(e.target.value) };
                                                setFormData(prev => ({ ...prev, advancedConfigurations: newConfigs }));
                                            }} className="w-full px-2 py-1 border rounded text-sm" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Specifications */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Specifications</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={specInput.label}
                                onChange={e => setSpecInput({ ...specInput, label: e.target.value })}
                                placeholder="Label (e.g. Flooring)"
                                className="flex-1 px-4 py-2 border rounded-lg"
                            />
                            <input
                                value={specInput.value}
                                onChange={e => setSpecInput({ ...specInput, value: e.target.value })}
                                placeholder="Value (e.g. Italian Marble)"
                                className="flex-1 px-4 py-2 border rounded-lg"
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                            />
                            <button type="button" onClick={addSpec} className="bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.specs.map((s, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                                    <div>
                                        <span className="font-medium text-slate-700">{s.label}: </span>
                                        <span className="text-slate-600">{s.value}</span>
                                    </div>
                                    <button type="button" onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-colors">
                            <Save className="w-5 h-5" />
                            Save Project
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
};

export default ProjectForm;
