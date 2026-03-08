import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, Heart, Search, SlidersHorizontal, Eye, X, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchFromMock } from '../api/client';
import { useCartStore } from '../lib/store';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PAGE_SIZE = 8;

export default function Marketplace() {
    const [allProducts, setAllProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loadingMore, setLoadingMore] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [addedId, setAddedId] = useState(null);
    const loaderRef = useRef(null);
    const { addItem } = useCartStore();

    useEffect(() => {
        fetchFromMock('products').then(data => data && setAllProducts(data));
    }, []);

    const categories = ['All', 'Foods', 'Medicines', 'Supplies', 'Toys'];
    const filtered = allProducts.filter(p => {
        const matchesCat = category === 'All' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    // Infinite scroll via IntersectionObserver
    const handleObserver = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loadingMore) {
            setLoadingMore(true);
            setTimeout(() => {
                setVisibleCount(c => c + PAGE_SIZE);
                setLoadingMore(false);
            }, 600);
        }
    }, [hasMore, loadingMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [handleObserver]);

    // Reset visible count when filter changes
    useEffect(() => { setVisibleCount(PAGE_SIZE); }, [category, searchQuery]);

    const handleAddToCart = (product, e) => {
        e?.stopPropagation();
        addItem(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <div className="min-h-screen bg-background pb-36 md:pb-16">
            {/* Quick View Modal */}
            <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-3xl border-none">
                    {quickViewProduct && (
                        <div className="flex flex-col sm:flex-row h-full">
                            <div className="sm:w-64 h-56 sm:h-auto relative overflow-hidden bg-muted shrink-0">
                                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                                <Badge className="absolute top-3 left-3 bg-primary/95 text-white border-none font-bold px-3 rounded-lg">
                                    {quickViewProduct.category}
                                </Badge>
                            </div>
                            <div className="p-8 flex flex-col justify-between flex-1">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight mb-2">{quickViewProduct.name}</h2>
                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                                        <span className="text-sm text-muted-foreground ml-1">(48 Reviews)</span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">{quickViewProduct.description}</p>
                                    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-muted/40 rounded-xl p-3">
                                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Category</p>
                                            <p className="font-bold">{quickViewProduct.category}</p>
                                        </div>
                                        <div className="bg-muted/40 rounded-xl p-3">
                                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                                            <p className="font-bold text-emerald-600">✓ In Stock</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Price</p>
                                        <p className="text-4xl font-black text-primary">${quickViewProduct.price.toFixed(2)}</p>
                                    </div>
                                    <Button
                                        onClick={(e) => { handleAddToCart(quickViewProduct, e); setQuickViewProduct(null); }}
                                        className="flex-1 h-14 rounded-2xl font-black text-base shadow-xl shadow-primary/20"
                                    >
                                        <ShoppingCart className="mr-2" /> Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Header */}
            <header className="bg-white border-b py-12 mb-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                                <ShoppingCart size={16} />
                                <span>LittlePaws Shop</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Pet Marketplace</h1>
                            <p className="text-muted-foreground text-lg max-w-md">
                                Everything your pet needs — {allProducts.length} premium products.
                            </p>
                        </div>
                        <div className="relative w-full md:w-[400px] group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                            <Input
                                type="text"
                                placeholder="Search premium products..."
                                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-muted/30 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6">
                {/* Category & Sort */}
                <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 gap-6">
                    <div className="flex gap-3">
                        {categories.map(cat => (
                            <Button key={cat} onClick={() => setCategory(cat)} variant={category === cat ? "default" : "outline"}
                                className={`rounded-full px-6 h-11 font-bold shrink-0 ${category === cat ? 'shadow-lg shadow-primary/20' : 'bg-white hover:bg-muted'}`}>
                                {cat}
                            </Button>
                        ))}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium shrink-0">
                        Showing <span className="font-bold text-foreground">{visible.length}</span> of <span className="font-bold text-foreground">{filtered.length}</span>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {visible.map((product, idx) => (
                            <motion.div key={product.id} layout
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: Math.min(idx, 7) * 0.04 }}>
                                <Card className="group relative h-full border-none shadow-2xl shadow-black/5 hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col bg-white">
                                    <div className="relative aspect-[16/16] overflow-hidden bg-muted">
                                        <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name} />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-5 gap-2">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setQuickViewProduct(product)}
                                                className="w-full font-bold h-10 rounded-xl bg-white/95 backdrop-blur text-primary hover:bg-white gap-2"
                                            >
                                                <Eye size={16} /> Quick View
                                            </Button>
                                        </div>

                                        <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur shadow-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors z-10">
                                            <Heart size={16} className="fill-current" />
                                        </Button>
                                        <Badge className="absolute top-3 left-3 bg-primary/95 text-white border-none font-bold px-3 py-1 rounded-lg shadow-sm text-xs z-10">
                                            {product.category}
                                        </Badge>
                                    </div>

                                    <CardHeader className="p-5 pb-0">
                                        <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                    </CardHeader>

                                    <CardContent className="p-5 py-3 flex-grow">
                                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                                        <div className="flex items-center gap-0.5 mt-2">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} className="fill-amber-400 text-amber-400" />)}
                                            <span className="text-[10px] text-muted-foreground ml-1">(48)</span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-5 pt-0 mt-auto">
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Price</span>
                                                <span className="text-2xl font-black text-foreground">${product.price.toFixed(2)}</span>
                                            </div>
                                            <Button
                                                variant={addedId === product.id ? "secondary" : "default"}
                                                onClick={(e) => handleAddToCart(product, e)}
                                                className={`rounded-2xl h-12 w-12 p-0 shadow-lg transition-all ${addedId === product.id ? 'bg-emerald-500 text-white shadow-emerald-200' : 'shadow-primary/20 hover:scale-105 active:scale-95'}`}
                                            >
                                                {addedId === product.id ? <Check size={20} /> : <ShoppingCart size={20} />}
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={loaderRef} className="mt-12 flex items-center justify-center py-8">
                    {loadingMore && (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex gap-2">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">Loading more products…</p>
                        </div>
                    )}
                    {!hasMore && filtered.length > 0 && (
                        <p className="text-muted-foreground text-sm font-medium py-4">
                            ✓ You've seen all {filtered.length} products
                        </p>
                    )}
                </div>

                {filtered.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                            <Search size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">No products found</h3>
                        <p className="text-muted-foreground text-lg mb-8">Try adjusting your filters or search keywords.</p>
                        <Button onClick={() => { setCategory('All'); setSearchQuery(''); }} variant="outline" className="rounded-full px-8 h-12 border-2">
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
