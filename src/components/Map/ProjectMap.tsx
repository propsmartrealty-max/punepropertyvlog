
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Project } from '../../types';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarkerClusterGroup from 'react-leaflet-cluster';

// Fix Leaflet Icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ProjectMapProps {
    projects: Project[];
}

// Component to fit bounds
const MapBoundsUpdater: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const map = useMap();

    React.useEffect(() => {
        if (projects.length > 0) {
            const bounds = L.latLngBounds(projects.map(p => [p.lat || 18.5204, p.lng || 73.8567]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [projects, map]);

    return null;
};

const ProjectMap: React.FC<ProjectMapProps> = ({ projects }) => {
    // Filter projects that have coordinates
    const mapProjects = projects.filter(p => p.lat && p.lng);
    const defaultCenter: [number, number] = [18.5204, 73.8567]; // Pune

    return (
        <div className="h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 sticky top-24">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapBoundsUpdater projects={mapProjects} />

                <MarkerClusterGroup chunkedLoading>
                    {mapProjects.map((project) => (
                        <Marker
                            key={project.id}
                            position={[project.lat!, project.lng!]}
                        >
                            <Popup className="custom-popup">
                                <div className="w-64 p-0">
                                    <Link to={`/project/${project.slug}`} className="block group">
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <img
                                                src={project.image || 'https://via.placeholder.com/300'}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                                                <p className="text-white font-bold text-lg leading-tight">{project.exactPrice || project.priceRange}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white rounded-b-lg">
                                            <h3 className="font-bold text-slate-800 text-sm truncate mr-2">{project.title}</h3>
                                            <p className="text-xs text-slate-500 mb-2">{project.location}</p>
                                            <div className="flex items-center text-xs font-bold text-brand-600">
                                                View Details <ArrowRight className="w-3 h-3 ml-1" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default ProjectMap;
