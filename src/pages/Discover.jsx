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
            <header className="px-4 pt-6 md:pt-8 mb-8 pb-4">
                <div className="max-w-6xl mx-auto relative rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10">
                    <div className="absolute inset-0 bg-black">
                        <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1600&auto=format&fit=crop" className="w-full h-full object-cover object-[center_30%] opacity-80" alt="Discover background" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
                    </div>

                    <div className="relative z-10 py-16 md:py-24 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-xl">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-widest mb-6 w-fit border border-white/20 shadow-lg">
                                <MapPin size={16} />
                                <span>Nearby Places</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 drop-shadow-xl text-white leading-[1.1]">
                                Explore The Best<br /><span className="text-primary italic">Destinations</span>
                            </h1>
                            <p className="text-white/80 text-lg md:text-xl font-medium drop-shadow-md leading-relaxed max-w-lg">
                                Find the most welcoming cafes, top-rated professional vets, and luxurious hotels tailored specifically for your furry companions.
                            </p>
                        </motion.div>

                        {/* View Toggle */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full md:w-auto">
                            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-[2rem] border border-white/20 shadow-2xl flex flex-col gap-3 max-w-xs mx-auto md:mx-0">
                                <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/70 px-2 text-center md:text-left">View Format</p>
                                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-2xl w-full">
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="lg"
                                        onClick={() => setViewMode('list')}
                                        className={`flex-1 rounded-xl font-bold gap-2 px-6 h-12 transition-all ${viewMode === 'list' ? 'shadow-lg bg-white text-foreground hover:bg-white/90' : 'text-white hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <List size={18} /> List
                                    </Button>
                                    <Button
                                        variant={viewMode === 'map' ? 'default' : 'ghost'}
                                        size="lg"
                                        onClick={() => setViewMode('map')}
                                        className={`flex-1 rounded-xl font-bold gap-2 px-6 h-12 transition-all ${viewMode === 'map' ? 'shadow-lg bg-white text-foreground hover:bg-white/90' : 'text-white hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <Map size={18} /> Map
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
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

                        {/* Featured Spot Banner */}
                        <div className="mb-12 relative rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5 border-none bg-gradient-to-r from-teal-500 to-emerald-400 group flex flex-col-reverse md:flex-row items-stretch min-h-[300px]">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

                            <div className="p-10 md:p-14 md:w-1/2 text-white relative z-10 flex flex-col justify-center">
                                <Badge className="bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-lg font-bold uppercase tracking-widest text-xs mb-6 w-fit py-1.5 px-4">✨ Top Rated This Week</Badge>
                                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight drop-shadow-md">The Barkery Cafe</h2>
                                <p className="text-white/90 font-medium mb-8 text-lg leading-relaxed max-w-md text-balance">Treat your pooch to our organically sourced, handmade pupuccinos while you enjoy an award-winning latte.</p>
                                <Button className="bg-white text-teal-600 hover:bg-white/90 rounded-2xl font-black px-8 h-14 shadow-xl shadow-black/10 hover:-translate-y-1 transition-all w-fit text-base">
                                    Reserve a Table
                                </Button>
                            </div>

                            <div className="relative md:w-1/2 h-64 md:h-auto min-h-[300px] w-full overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Featured Cafe" />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-teal-500/80 md:from-teal-500/90 via-teal-500/20 to-transparent"></div>
                            </div>
                        </div>

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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {services.filter(s => s.type === tab.value).map((service, idx) => (
                                            <motion.div key={service.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}>
                                                <Link to={`/service/${service.id}`}>
                                                    <Card className="relative overflow-hidden border-none shadow-2xl shadow-primary/5 hover:shadow-primary/20 rounded-[2.5rem] group h-[480px] cursor-pointer transition-all duration-500">
                                                        <img src={service.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={service.name} />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                                                        {/* Top Elements */}
                                                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                                                            <Badge className={`bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 font-black px-4 py-1.5 text-xs tracking-[0.2em] uppercase shadow-xl transition-colors`}>
                                                                {service.type}
                                                            </Badge>
                                                            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-sm font-black text-white border border-white/20 shadow-xl transition-all group-hover:bg-amber-500/90 group-hover:border-amber-400">
                                                                <Star size={14} className="fill-amber-400 text-amber-400 group-hover:fill-white group-hover:text-white transition-colors" />
                                                                {service.rating}
                                                            </div>
                                                        </div>

                                                        {/* Bottom Content */}
                                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transform transition-transform duration-500 group-hover:-translate-y-4">
                                                            <h3 className="font-black text-3xl text-white mb-3 leading-tight tracking-tight drop-shadow-xl">{service.name}</h3>

                                                            <p className="text-white/90 text-sm flex items-start gap-2 mb-4 font-medium drop-shadow-md">
                                                                <MapPin size={18} className="shrink-0 text-primary mt-0.5" />
                                                                <span className="line-clamp-2">{service.address}</span>
                                                            </p>

                                                            <p className="text-white/70 text-sm mb-8 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
                                                                {service.description}
                                                            </p>

                                                            <div className="overflow-hidden">
                                                                <div className="flex items-center gap-3 text-white font-black text-sm uppercase tracking-[0.15em] transform transition-all duration-500 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 border-t border-white/20 pt-6">
                                                                    {service.type === 'Vet' ? 'Book Appointment' : 'View Details'}
                                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                                                                        <MapPin size={14} className="text-primary group-hover:text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            </motion.div>
                                        ))}
                                        {services.filter(s => s.type === tab.value).length === 0 && (
                                            <div className="col-span-full py-24 text-center flex flex-col items-center">
                                                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                                                    <MapPin size={32} strokeWidth={1.5} />
                                                </div>
                                                <h3 className="text-2xl font-black text-foreground mb-2">No {tab.label.toLowerCase()} found</h3>
                                                <p className="text-muted-foreground text-lg">We couldn't find any {tab.label.toLowerCase()} in your area.</p>
                                            </div>
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
