import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFromMock } from '../api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '../lib/store';
import { MapPin, Calendar, Heart, PawPrint } from 'lucide-react';

export default function PetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const { addItem } = useCartStore();

    useEffect(() => {
        fetchFromMock(`pets/${id}`).then(data => data && setPet(data));
    }, [id]);

    if (!pet) return (
        <div className="p-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const handleAction = () => {
        if (pet.type === 'Buy') {
            addItem({ ...pet, name: `${pet.name} (${pet.breed})` });
            navigate('/checkout');
        } else {
            alert(`Adoption inquiry sent for ${pet.name}! Our team will contact you shortly.`);
        }
    };

    return (
        <div className="container max-w-6xl mx-auto py-12 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/10">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {[['🐾', 'Species', pet.species], ['📅', 'Age', pet.age], ['⚧', 'Gender', pet.gender]].map(([icon, label, value]) => (
                            <div key={label} className="bg-muted/40 rounded-2xl p-4">
                                <span className="text-2xl block mb-1">{icon}</span>
                                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">{label}</p>
                                <p className="font-black text-lg">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:sticky lg:top-24 space-y-8">
                    <div>
                        <Badge className={`mb-4 rounded-lg font-bold px-3 py-1 border-none ${pet.type === 'Adopt' ? 'bg-emerald-500 text-white' : 'bg-primary text-white'}`}>
                            {pet.type === 'Adopt' ? '🏠 Available for Adoption' : '🐾 Available for Purchase'}
                        </Badge>
                        <h1 className="text-5xl font-black tracking-tight mb-2">{pet.name}</h1>
                        <p className="text-xl text-muted-foreground font-semibold mb-6">{pet.breed}</p>
                        <p className="text-muted-foreground leading-relaxed text-lg">{pet.description}</p>
                    </div>

                    <div className="flex items-center gap-4 py-6 border-y">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-1">
                                {pet.type === 'Adopt' ? 'Adoption Fee' : 'Purchase Price'}
                            </p>
                            <p className="text-5xl font-black text-primary">{pet.price === 0 ? 'Free' : `$${pet.price}`}</p>
                        </div>
                        <Badge variant="outline" className="rounded-xl text-sm px-4 py-2 font-bold text-emerald-600 border-emerald-200 bg-emerald-50">
                            ✓ {pet.status}
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <Button onClick={handleAction} className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/30 hover:-translate-y-1 transition-transform">
                            <PawPrint className="mr-3" />
                            {pet.type === 'Adopt' ? 'Start Adoption Process' : 'Buy & Take Home'}
                        </Button>
                        <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors">
                            <Heart className="mr-2" /> Save to Wishlist
                        </Button>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-6 space-y-2 text-sm text-muted-foreground">
                        <p className="font-bold text-foreground">What's included:</p>
                        <ul className="space-y-1">
                            <li>✅ Vaccinations & health records</li>
                            <li>✅ Microchipped & registered</li>
                            <li>✅ Vet health certificate</li>
                            {pet.type === 'Adopt' && <li>✅ Spay/Neuter completed</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
