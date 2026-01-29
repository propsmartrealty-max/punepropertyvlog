import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { DataProvider } from './context/DataContext';
import ScrollToTop from './components/ScrollToTop';

// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const BuilderDetails = React.lazy(() => import('./pages/BuilderDetails'));
const Directory = React.lazy(() => import('./pages/Directory'));

// Admin Pages
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = React.lazy(() => import('./pages/admin/Projects'));
const AdminProjectForm = React.lazy(() => import('./pages/admin/ProjectForm'));
const AdminBuilders = React.lazy(() => import('./pages/admin/Builders'));
const AdminBuilderForm = React.lazy(() => import('./pages/admin/BuilderForm'));
const AdminBanners = React.lazy(() => import('./pages/admin/Banners'));
const AdminLocalities = React.lazy(() => import('./pages/admin/Localities'));
const AdminSeedData = React.lazy(() => import('./pages/admin/SeedData'));

const LoadingFallback = () => (
    <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
);

// Protected Route Component
import ProtectedRoute from './components/Admin/ProtectedRoute';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <DataProvider>
                    <Router>
                        <ScrollToTop />
                        <React.Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/search" element={<SearchResults />} />
                                <Route path="/directory" element={<Directory />} />
                                <Route path="/project/:slug" element={<ProjectDetails />} />
                                <Route path="/builder/:slug" element={<BuilderDetails />} />

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
                                    <Route path="/admin/seed" element={<AdminSeedData />} />
                                </Route>
                            </Routes>
                        </React.Suspense>
                    </Router>
                </DataProvider>
            </HelmetProvider>
        </QueryClientProvider>
    );
}


export default App;
