import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFromMock } from '../api/client';
import { useCartStore } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, Check, Heart, Eye, Minus, Plus } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCartStore();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null); // Add if necessary or omit

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setQuantity(1);
        fetchFromMock('products').then(data => {
            if (data) {
                const found = data.find(p => String(p.id) === String(id));
                setProduct(found);
                if (found) {
                    const related = data.filter(p => p.category === found.category && String(p.id) !== String(id)).slice(0, 4);
                    setRelatedProducts(related);
                }
            }
            setLoading(false);
        });
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pb-32">
                <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pb-32">
                <h2 className="text-3xl font-black mb-4">Product Not Found</h2>
                <Button onClick={() => navigate('/marketplace')} className="rounded-full px-8 h-12">Return to Shop</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header & Breadcrumb */}
            <div className="bg-white border-b py-6 mb-8 sticky top-[72px] z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={() => navigate('/marketplace')}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/marketplace')}>Marketplace</span>
                        <span>/</span>
                        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate(`/marketplace?category=${product.category}`)}>{product.category}</span>
                        <span>/</span>
                        <span className="text-foreground line-clamp-1">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20"
                >
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-[3rem] overflow-hidden bg-muted group relative shadow-2xl shadow-primary/5">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur text-primary hover:bg-white border-none font-black px-4 py-2 rounded-xl text-sm shadow-xl">
                                {product.category}
                            </Badge>
                            <Button variant="ghost" size="icon" className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-xl">
                                <Heart size={20} className="fill-current" />
                            </Button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} className="fill-amber-400 text-amber-400" />)}
                            <span className="text-muted-foreground font-medium ml-2 hover:underline cursor-pointer">(128 Reviews)</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="text-4xl font-black text-primary mb-6">
                            ${product.price.toFixed(2)}
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="bg-muted/30 rounded-3xl p-6 mb-8 border border-border/50">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center bg-white rounded-2xl border p-1 shadow-sm w-full sm:w-auto">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 rounded-xl"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 rounded-xl"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    className={`flex-1 w-full h-14 rounded-2xl font-black text-lg transition-all shadow-xl ${added ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'shadow-primary/20 hover:scale-[1.02]'}`}
                                >
                                    {added ? (
                                        <span className="flex items-center gap-2"><Check size={20} /> Added to Cart</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><ShoppingCart size={20} /> Add to Cart</span>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-primary/5 text-primary">
                                <ShieldCheck size={28} className="mb-2" />
                                <span className="font-bold text-sm">Premium Quality</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-emerald-500/5 text-emerald-600">
                                <Truck size={28} className="mb-2" />
                                <span className="font-bold text-sm">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-blue-500/5 text-blue-600">
                                <RotateCcw size={28} className="mb-2" />
                                <span className="font-bold text-sm">30-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="pt-12 border-t"
                    >
                        <h2 className="text-3xl font-black tracking-tight mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((relProduct, idx) => (
                                <motion.div
                                    key={relProduct.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    onClick={() => navigate(`/product/${relProduct.id}`)}
                                    className="cursor-pointer"
                                >
                                    <Card className="group h-full border-none shadow-xl shadow-black/5 hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col bg-white">
                                        <div className="aspect-square relative overflow-hidden bg-muted">
                                            <img src={relProduct.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={relProduct.name} />
                                            <Badge className="absolute top-3 left-3 bg-white/90 text-primary border-none font-bold px-3 py-1 rounded-lg shadow-sm text-xs z-10">
                                                {relProduct.category}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-5 py-4 flex-grow">
                                            <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">{relProduct.name}</h3>
                                            <div className="text-xl font-black text-foreground">${relProduct.price.toFixed(2)}</div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
