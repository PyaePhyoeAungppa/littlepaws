import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore, useCartStore } from '../../lib/store';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UserWishlist() {
    const navigate = useNavigate();
    const { items, toggleItem } = useWishlistStore();
    const { addItem } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-32">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <Heart size={40} className="text-rose-300" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-black mb-2">Your Wishlist is Empty</h2>
                <p className="text-muted-foreground mb-8">Save products and pets you love to view them later.</p>
                <div className="flex gap-4">
                    <Button onClick={() => navigate('/marketplace')} className="rounded-full px-8 h-12">Shop Products</Button>
                    <Button onClick={() => navigate('/pets')} variant="outline" className="rounded-full px-8 h-12">Find Pets</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24 pt-8">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-10">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <Heart className="fill-rose-500 text-rose-500" size={32} /> My Wishlist
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item) => {
                        const isPet = item.species !== undefined; // differentiate pets vs products
                        return (
                            <Card key={item.id} className="group relative h-full border-none shadow-xl shadow-black/5 hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col bg-white">
                                <div
                                    className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
                                    onClick={() => navigate(isPet ? `/pets/${item.id}` : `/product/${item.id}`)}
                                >
                                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                                    <Badge className="absolute top-3 left-3 bg-white/95 text-foreground border-none font-bold px-3 py-1 rounded-lg shadow-sm text-xs">
                                        {isPet ? 'Pet' : 'Product'}
                                    </Badge>
                                </div>
                                <CardHeader className="p-5 pb-0">
                                    <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                                </CardHeader>
                                <CardContent className="p-5 py-3 flex-grow mt-auto flex flex-col">
                                    <div className="text-2xl font-black text-foreground mb-4">
                                        ${item.price.toFixed(2)}
                                    </div>
                                    <div className="flex gap-2">
                                        {!isPet && (
                                            <Button
                                                className="flex-1 rounded-xl shadow-lg shadow-primary/20"
                                                onClick={() => addItem(item)}
                                            >
                                                <ShoppingCart size={16} className="mr-2" /> Add
                                            </Button>
                                        )}
                                        {isPet && (
                                            <Button
                                                className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/20"
                                                onClick={() => navigate(`/pets/${item.id}`)}
                                            >
                                                View Pet
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"
                                            onClick={() => toggleItem(item)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
