import React, { useState, useEffect } from 'react';
import { Search, MapPin, Coffee, Stethoscope, Hotel, Heart, ArrowRight, PawPrint, ShoppingCart, Star, Tag, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFromMock } from '../api/client';
import { useCartStore } from '../lib/store';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [pets, setPets] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [copiedCode, setCopiedCode] = useState(null);
    const [search, setSearch] = useState('');
    const { addItem } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFromMock('products').then(data => data && setProducts(data));
        fetchFromMock('services').then(data => data && setServices(data));
        fetchFromMock('pets').then(data => data && setPets(data));
        fetchFromMock('promotions').then(data => data && setPromotions(data));
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/marketplace?q=${encodeURIComponent(search)}`);
    };

    const quickCategories = [
        { icon: <PawPrint />, label: 'Adopt a Pet', to: '/pets?type=Adopt', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
        { icon: <Coffee />, label: 'Pet Cafes', to: '/discover', color: 'bg-orange-50 text-orange-600 border-orange-100' },
        { icon: <Stethoscope />, label: 'Find a Vet', to: '/discover', color: 'bg-teal-50 text-teal-600 border-teal-100' },
        { icon: <Hotel />, label: 'Pet Hotels', to: '/discover', color: 'bg-violet-50 text-violet-600 border-violet-100' },
        { icon: <ShoppingCart />, label: 'Shop Supplies', to: '/marketplace', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    ];

    const featuredPets = pets.slice(0, 4);

    return (
        <div className="pb-36 md:pb-8 space-y-12 md:space-y-16 animate-in fade-in duration-700">
            {/* Hero */}
            <section className="relative px-4 pt-8 md:pt-12">
                <div className="max-w-6xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 border shadow-2xl shadow-primary/5">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                    <div className="relative z-10 py-12 md:py-20 px-4 md:px-12 text-center flex flex-col items-center">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                            <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/20 text-primary bg-primary/5 rounded-full">
                                🐾 Explore LittlePaws
                            </Badge>
                            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground mb-5 leading-tight">
                                Everything your <span className="text-primary italic">pet</span> needs.
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                                Find the best cafes, professional vets, premium supplies, and adorable pets — all in one beautiful place.
                            </p>
                            <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={22} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search products, services, pets..."
                                    className="w-full py-5 pl-14 pr-6 rounded-2xl bg-white border border-border shadow-lg focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-lg transition-all"
                                />
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Categories */}
            <section className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-1">Quick Access</h2>
                    <p className="text-muted-foreground">Jump straight to what your pet needs today.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {quickCategories.map((cat, idx) => (
                        <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                            <Link to={cat.to}>
                                <div className="flex flex-col items-center gap-3 group cursor-pointer p-4">
                                    <div className={`p-6 rounded-[2rem] ${cat.color} border transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl flex items-center justify-center`}>
                                        {React.cloneElement(cat.icon, { size: 32, strokeWidth: 2.5 })}
                                    </div>
                                    <span className="font-bold text-sm text-center tracking-tight group-hover:text-primary transition-colors">{cat.label}</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Pets */}
            <section className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black mb-1">🐶 Pets Looking for a Home</h2>
                        <p className="text-muted-foreground">Adopt or buy your perfect companion today.</p>
                    </div>
                    <Link to="/pets">
                        <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 gap-2">
                            View All <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredPets.map((pet, idx) => (
                        <motion.div key={pet.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }}>
                            <Link to={`/pets/${pet.id}`}>
                                <Card className="border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 cursor-pointer bg-white">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <Badge className={`absolute top-3 left-3 rounded-lg font-bold border-none text-xs ${pet.type === 'Adopt' ? 'bg-emerald-500 text-white' : 'bg-primary text-white'}`}>
                                            {pet.type === 'Adopt' ? '🏠 Adopt' : '🐾 Buy'}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-black text-lg group-hover:text-primary transition-colors">{pet.name}</h3>
                                            <Badge variant="outline" className="text-xs rounded-lg">{pet.gender}</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">{pet.breed} · {pet.age}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-black text-primary">{pet.price === 0 ? 'Free' : `$${pet.price}`}</span>
                                            <Button size="sm" className="rounded-xl font-bold text-xs px-3 shadow-md shadow-primary/20">
                                                {pet.type === 'Adopt' ? 'Adopt' : 'Buy'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Products Carousel */}
            <section className="max-w-6xl mx-auto px-6 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black mb-1">🛍 New Arrivals</h2>
                        <p className="text-muted-foreground">Hand-picked premium products for your pets.</p>
                    </div>
                    <Link to="/marketplace">
                        <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 gap-2">
                            View All <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                <Carousel className="w-full">
                    <CarouselContent className="-ml-4">
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <Card className="border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 bg-white">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <Button variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur">
                                            <Heart className="w-5 h-5 text-destructive" />
                                        </Button>
                                    </div>
                                    <CardContent className="p-6">
                                        <Badge variant="secondary" className="mb-3 rounded-full font-bold uppercase text-[10px] tracking-widest">{product.category}</Badge>
                                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-black text-foreground">${product.price.toFixed(2)}</span>
                                            <Button onClick={() => addItem(product)} size="icon" className="rounded-xl w-12 h-12 shadow-lg shadow-primary/20">
                                                <ShoppingCart size={18} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden md:block">
                        <CarouselPrevious className="-left-12 border-none shadow-xl" />
                        <CarouselNext className="-right-12 border-none shadow-xl" />
                    </div>
                </Carousel>
            </section>

            {/* Hot Deals & Promotions */}
            {promotions.length > 0 && (
                <section className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-black mb-1">🔥 Hot Deals & Promotions</h2>
                            <p className="text-muted-foreground">Limited-time offers — grab them before they're gone!</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {promotions.map((promo, idx) => {
                            const gradients = [
                                'from-orange-500 to-red-500',
                                'from-teal-500 to-emerald-500',
                                'from-violet-500 to-purple-600',
                                'from-blue-500 to-cyan-500',
                            ];
                            const grad = gradients[idx % gradients.length];
                            return (
                                <motion.div key={promo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                                    <div className={`relative bg-gradient-to-br ${grad} rounded-3xl p-6 text-white overflow-hidden shadow-xl shadow-black/10 group cursor-pointer`}>
                                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full" />
                                        <div className="relative z-10">
                                            <Badge className="mb-3 bg-white/20 text-white border-white/30 font-bold text-xs backdrop-blur-sm">
                                                {promo.badge}
                                            </Badge>
                                            {promo.discount > 0 && (
                                                <div className="text-4xl font-black mb-1">{promo.discount}% <span className="text-xl font-bold opacity-80">OFF</span></div>
                                            )}
                                            <h3 className="font-black text-base leading-tight mb-2">{promo.title}</h3>
                                            <p className="text-white/80 text-xs mb-4 leading-relaxed">{promo.description}</p>
                                            {promo.code && (
                                                <button
                                                    onClick={() => copyCode(promo.code)}
                                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-xl px-3 py-2 transition-all w-full"
                                                >
                                                    <Tag size={12} />
                                                    <span className="font-mono font-black text-sm tracking-widest flex-1 text-left">{promo.code}</span>
                                                    <Copy size={12} className="opacity-70" />
                                                </button>
                                            )}
                                            {copiedCode === promo.code && (
                                                <p className="text-white/80 text-xs mt-2 text-center">✓ Copied!</p>
                                            )}
                                            {promo.expires && (
                                                <p className="text-white/60 text-[10px] mt-3 text-right">
                                                    Expires {new Date(promo.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Services Tabs */}
            <section className="max-w-6xl mx-auto px-6 pb-6">
                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-1">📍 Pet Discovery</h2>
                    <p className="text-muted-foreground">Find and book the best places nearby.</p>
                </div>

                <Tabs defaultValue="Cafe" className="w-full">
                    <TabsList className="bg-muted/50 p-1 h-14 rounded-2xl mb-10 flex w-fit border gap-1">
                        {['Cafe', 'Vet', 'Hotel'].map(tab => (
                            <TabsTrigger key={tab} value={tab}
                                className="px-8 h-full rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all">
                                {tab}s
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {['Cafe', 'Vet', 'Hotel'].map(type => (
                        <TabsContent key={type} value={type} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {services.filter(s => s.type === type).map(service => (
                                    <Card key={service.id} className="overflow-hidden border-none shadow-xl shadow-black/5 rounded-[2rem] group">
                                        <div className="flex flex-col sm:flex-row h-full">
                                            <div className="sm:w-44 h-44 relative overflow-hidden shrink-0">
                                                <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={service.name} />
                                            </div>
                                            <div className="p-6 flex flex-col justify-between flex-1">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">{service.name}</h3>
                                                        <div className="flex items-center gap-1 bg-amber-50 font-black px-2.5 py-1 rounded-full text-xs border border-amber-100 text-amber-700 shrink-0 ml-2">
                                                            <Star size={11} className="fill-current" /> {service.rating}
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm flex items-start gap-1.5 mt-2">
                                                        <MapPin size={14} className="shrink-0 text-primary mt-0.5" />
                                                        <span className="line-clamp-2">{service.address}</span>
                                                    </p>
                                                </div>
                                                <Link to={`/service/${service.id}`} className="mt-5">
                                                    <Button variant="outline" className="rounded-2xl font-black h-11 w-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all text-sm">
                                                        {type === 'Vet' ? '📅 Book Appointment' : '→ View Details'}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>
        </div>
    );
}
