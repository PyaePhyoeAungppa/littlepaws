import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Search, Heart } from 'lucide-react';
import { fetchFromMock } from '../api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function Pets() {
    const [pets, setPets] = useState([]);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchFromMock('pets').then(data => data && setPets(data));
    }, []);

    const categories = ['All', 'Dog', 'Cat', 'Rabbit'];
    const types = ['All', 'Buy', 'Adopt'];
    const [typeFilter, setTypeFilter] = useState('All');

    const filtered = pets.filter(p => {
        const matchesSpecies = filter === 'All' || p.species === filter;
        const matchesType = typeFilter === 'All' || p.type === typeFilter;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.breed.toLowerCase().includes(search.toLowerCase());
        return matchesSpecies && matchesType && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background pb-36 md:pb-16">
            <header className="bg-white border-b py-12 mb-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                                <PawPrint size={16} />
                                <span>Find Your Companion</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Pets for Adoption & Sale</h1>
                            <p className="text-muted-foreground text-lg max-w-md">Give a loving pet their forever home or find your perfect new companion.</p>
                        </div>
                        <div className="relative w-full md:w-[360px] group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                            <Input
                                type="text"
                                placeholder="Search by name or breed..."
                                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-muted/30 border-none shadow-inner"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-wrap gap-3 mb-8">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <Button key={cat} onClick={() => setFilter(cat)} variant={filter === cat ? 'default' : 'outline'}
                                className={`rounded-full px-5 h-11 font-bold ${filter === cat ? 'shadow-primary/20 shadow-lg' : 'bg-white hover:bg-muted'}`}>{cat}</Button>
                        ))}
                    </div>
                    <div className="flex gap-2 flex-wrap ml-auto">
                        {types.map(t => (
                            <Button key={t} onClick={() => setTypeFilter(t)} variant={typeFilter === t ? 'secondary' : 'outline'}
                                className={`rounded-full px-5 h-11 font-bold ${typeFilter === t ? 'shadow-md' : 'bg-white hover:bg-muted'}`}>{t}</Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((pet, idx) => (
                            <motion.div key={pet.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                                <Link to={`/pets/${pet.id}`}>
                                    <Card className="group relative h-full border-none shadow-2xl shadow-black/5 hover:shadow-primary/10 transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col bg-white cursor-pointer hover:-translate-y-2">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x450/f3f4f6/9ca3af?text=🐾'; }} />
                                            <Badge className={`absolute top-4 left-4 rounded-lg font-bold px-3 py-1 border-none shadow-sm ${pet.type === 'Adopt' ? 'bg-emerald-500 text-white' : 'bg-primary text-white'}`}>
                                                {pet.type === 'Adopt' ? '🏠 Adopt' : '🐾 Buy'}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur shadow-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                                                <Heart size={18} className="fill-current" />
                                            </Button>
                                        </div>
                                        <CardContent className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className="font-black text-2xl tracking-tight group-hover:text-primary transition-colors">{pet.name}</h3>
                                                <Badge variant="outline" className="rounded-lg font-bold">{pet.gender}</Badge>
                                            </div>
                                            <p className="text-muted-foreground font-medium mb-1">{pet.breed} · {pet.age}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1 mt-2">{pet.description}</p>
                                            <div className="flex items-center justify-between mt-6">
                                                <span className="text-3xl font-black text-primary">
                                                    {pet.price === 0 ? 'Free' : `$${pet.price}`}
                                                </span>
                                                <Button className="rounded-2xl font-bold px-6 shadow-lg shadow-primary/20">
                                                    {pet.type === 'Adopt' ? 'Adopt Now' : 'Buy Now'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="col-span-full py-20 text-center flex flex-col items-center">
                            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                                <PawPrint size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-black mb-2">No pets found</h3>
                            <p className="text-muted-foreground text-lg mb-8">Try adjusting your filters.</p>
                            <Button onClick={() => { setFilter('All'); setTypeFilter('All'); setSearch(''); }} variant="outline" className="rounded-full px-8 h-12 border-2">Clear all filters</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
