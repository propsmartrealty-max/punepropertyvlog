import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { DataProvider } from './context/DataContext';
import ScrollToTop from './components/ScrollToTop';
import CompareFloatingBar from './components/Portal/CompareFloatingBar';

// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const BuilderDetails = React.lazy(() => import('./pages/BuilderDetails'));
const Directory = React.lazy(() => import('./pages/Directory'));
const PostProperty = React.lazy(() => import('./pages/PostProperty'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Admin Pages
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = React.lazy(() => import('./pages/admin/Projects'));
const AdminProjectForm = React.lazy(() => import('./pages/admin/ProjectForm'));
const AdminBuilders = React.lazy(() => import('./pages/admin/Builders'));
const AdminBuilderForm = React.lazy(() => import('./pages/admin/BuilderForm'));
const AdminBanners = React.lazy(() => import('./pages/admin/Banners'));
const AdminLocalities = React.lazy(() => import('./pages/admin/Localities'));
const AdminLeads = React.lazy(() => import('./pages/admin/Leads'));
const AdminSeedData = React.lazy(() => import('./pages/admin/SeedData'));
const AdminMedia = React.lazy(() => import('./pages/admin/MediaGallery'));
const CompareProjects = React.lazy(() => import('./pages/CompareProjects'));

const LoadingFallback = () => (
    <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
);

// Protected Route Component
import ProtectedRoute from './components/Admin/ProtectedRoute';
import GlobalErrorBoundary from './components/Error/GlobalErrorBoundary';
import NotFound from './pages/NotFound';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <DataProvider>
                    <GlobalErrorBoundary>
                        <Router>
                            <ScrollToTop />
                            <Toaster position="top-center" />
                            <React.Suspense fallback={<LoadingFallback />}>
                                <CompareFloatingBar />
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/search" element={<SearchResults />} />
                                    <Route path="/directory" element={<Directory />} />
                                    <Route path="/flats-in-:locationSlug" element={<SearchResults />} />
                                    <Route path="/project/:slug" element={<ProjectDetails />} />
                                    <Route path="/builder/:slug" element={<BuilderDetails />} />

                                    {/* Static & Form Pages */}
                                    <Route path="/compare" element={<CompareProjects />} />
                                    <Route path="/post-property" element={<PostProperty />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />

                                    {/* Public Admin Route */}
                                    <Route path="/admin" element={<AdminLogin />} />

                                    {/* Protected Admin Routes */}
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                        <Route path="/admin/projects" element={<AdminProjects />} />
                                        <Route path="/admin/projects/new" element={<AdminProjectForm />} />
                                        <Route path="/admin/projects/:id" element={<AdminProjectForm />} />
                                        <Route path="/admin/builders" element={<AdminBuilders />} />
                                        <Route path="/admin/builders/new" element={<AdminBuilderForm />} />
                                        <Route path="/admin/builders/:id" element={<AdminBuilderForm />} />
                                        <Route path="/admin/banners" element={<AdminBanners />} />
                                        <Route path="/admin/localities" element={<AdminLocalities />} />

                                        <Route path="/admin/media" element={<AdminMedia />} />

                                        <Route path="/admin/leads" element={<AdminLeads />} />
                                        <Route path="/admin/seed" element={<AdminSeedData />} />
                                    </Route>

                                    {/* 404 Fallback */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </React.Suspense>
                        </Router>
                    </GlobalErrorBoundary>
                </DataProvider>
            </HelmetProvider>
        </QueryClientProvider >
    );
}


export default App;
