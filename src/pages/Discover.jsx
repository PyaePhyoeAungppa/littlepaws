import React, { useState, useEffect } from 'react';
import { MapPin, Coffee, Stethoscope, Hotel, Star, Map, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchFromMock } from '../api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import ServiceMapView from '../components/map/ServiceMapView';

export default function Discover() {
    const [services, setServices] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
    const [mapServices, setMapServices] = useState([]);

    useEffect(() => {
        fetchFromMock('services').then(data => {
            if (data) {
                setServices(data);
                setMapServices(data);
            }
        });
    }, []);

    const tabs = [
        { value: 'Cafe', label: 'Cafes', icon: <Coffee size={16} />, color: 'text-orange-600' },
        { value: 'Vet', label: 'Vets', icon: <Stethoscope size={16} />, color: 'text-teal-600' },
        { value: 'Hotel', label: 'Hotels', icon: <Hotel size={16} />, color: 'text-violet-600' },
    ];

    return (
        <div className="min-h-screen pb-24 md:pb-12">
            <header className="bg-white border-b py-12 mb-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                                <MapPin size={16} />
                                <span>Nearby Places</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Discover Pet Services</h1>
                            <p className="text-muted-foreground text-lg max-w-xl">Find the best cafes, vets, and hotels for your companions.</p>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border self-start">
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="rounded-xl font-bold gap-2 px-4"
                            >
                                <List size={16} /> List
                            </Button>
                            <Button
                                variant={viewMode === 'map' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('map')}
                                className="rounded-xl font-bold gap-2 px-4"
                            >
                                <Map size={16} /> Map
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6">
                {/* Map View */}
                {viewMode === 'map' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <div className="mb-6">
                            <h2 className="text-2xl font-black mb-1">📍 All Services Near You</h2>
                            <p className="text-muted-foreground">Click a pin to see details and book directly.</p>
                        </div>
                        <ServiceMapView services={mapServices} />
                    </motion.div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <Tabs defaultValue="Cafe" className="w-full">
                            <TabsList className="bg-muted/50 p-1 h-14 rounded-2xl mb-10 flex w-fit border gap-1">
                                {tabs.map(tab => (
                                    <TabsTrigger key={tab.value} value={tab.value}
                                        className="px-8 h-full rounded-xl font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all">
                                        {tab.icon} {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {tabs.map(tab => (
                                <TabsContent key={tab.value} value={tab.value} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {services.filter(s => s.type === tab.value).map((service, idx) => (
                                            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                                <Card className="overflow-hidden border-none shadow-xl shadow-black/5 rounded-[2rem] group flex flex-col sm:flex-row h-full">
                                                    <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden shrink-0">
                                                        <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={service.name} />
                                                    </div>
                                                    <div className="p-8 flex flex-col justify-between flex-1">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="font-bold text-2xl tracking-tight leading-tight group-hover:text-primary transition-colors">{service.name}</h3>
                                                                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-black px-3 py-1 rounded-full text-xs border border-amber-100 shrink-0 ml-2">
                                                                    <Star size={12} className="fill-current" /> {service.rating}
                                                                </div>
                                                            </div>
                                                            <Badge variant="secondary" className="rounded-lg mb-3 font-semibold">{service.type}</Badge>
                                                            <p className="text-muted-foreground text-sm flex items-start gap-1.5 mt-2">
                                                                <MapPin size={16} className="shrink-0 text-primary mt-0.5" />
                                                                <span>{service.address}</span>
                                                            </p>
                                                            {service.description && (
                                                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{service.description}</p>
                                                            )}
                                                        </div>
                                                        <Link to={`/service/${service.id}`} className="mt-6">
                                                            <Button variant="outline" className="rounded-2xl font-black h-12 w-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                                                {service.type === 'Vet' ? '📅 Book Appointment' : '→ View Details'}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                        {services.filter(s => s.type === tab.value).length === 0 && (
                                            <p className="col-span-full text-center text-muted-foreground py-12">No {tab.label.toLowerCase()} listed yet.</p>
                                        )}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
