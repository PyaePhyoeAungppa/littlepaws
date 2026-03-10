import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useWishlistStore } from '../../lib/store';
import { fetchFromMock } from '../../api/client';
import { User, Settings, Package, Heart, LogOut, ChevronRight, MapPin, Bone, ShoppingBag, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function UserProfile() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const wishlistItems = useWishlistStore(s => s.items);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        fetchFromMock('orders').then(data => {
            setOrders(data || []);
            setLoadingOrders(false);
        });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        {
            icon: <Package size={20} />,
            label: 'Order History',
            value: loadingOrders ? '...' : `${orders.length} Order${orders.length !== 1 ? 's' : ''}`,
            color: 'text-blue-500', bg: 'bg-blue-50',
            onClick: () => document.getElementById('orders-section')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            icon: <Heart size={20} />,
            label: 'My Wishlist',
            value: `${wishlistItems.length} Saved Item${wishlistItems.length !== 1 ? 's' : ''}`,
            color: 'text-rose-500', bg: 'bg-rose-50',
            onClick: () => navigate('/user/wishlist')
        },
        {
            icon: <ShoppingBag size={20} />,
            label: 'Browse Shop',
            value: 'Find products',
            color: 'text-purple-500', bg: 'bg-purple-50',
            onClick: () => navigate('/marketplace')
        },
        {
            icon: <Bone size={20} />,
            label: 'Find a Pet',
            value: 'Adopt or buy',
            color: 'text-amber-500', bg: 'bg-amber-50',
            onClick: () => navigate('/pets')
        },
        {
            icon: <MapPin size={20} />,
            label: 'Discover Cafes & Vets',
            value: 'Explore nearby',
            color: 'text-emerald-500', bg: 'bg-emerald-50',
            onClick: () => navigate('/discover')
        },
        {
            icon: <Settings size={20} />,
            label: 'Account Settings',
            value: user?.email || '',
            color: 'text-slate-500', bg: 'bg-slate-100',
            onClick: null
        },
    ];

    const totalSpent = orders.reduce((sum, o) => sum + (o.total || o.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0), 0);
    const rewardPoints = Math.round(totalSpent * 10);

    return (
        <div className="min-h-screen bg-background pb-24 pt-10">
            <div className="max-w-4xl mx-auto px-6 space-y-8">

                <h1 className="text-4xl font-black tracking-tight">My Profile</h1>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-black/5 border border-border/50 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[100px] -z-0 pointer-events-none" />

                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                            <User size={56} className="text-primary/60" />
                        </div>
                        <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white border-2 border-white px-3 py-1 font-bold rounded-lg shadow-sm whitespace-nowrap text-xs">
                            Premium Member
                        </Badge>
                    </div>

                    <div className="flex-1 text-center md:text-left relative z-10">
                        <h2 className="text-3xl font-black tracking-tight mb-1">{user?.name || 'Pyae'}</h2>
                        <p className="text-muted-foreground font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                            <User size={16} /> {user?.email || 'Not logged in'}
                        </p>

                        <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-6">
                            <div>
                                <p className="text-3xl font-black text-foreground">{loadingOrders ? '—' : orders.length}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Orders</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-foreground">{wishlistItems.length}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Wishlist Items</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-primary">{rewardPoints}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reward Points</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map((item, idx) => (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.06 }}
                            onClick={item.onClick}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all flex items-center justify-between group text-left disabled:opacity-50"
                            disabled={!item.onClick}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{item.label}</h3>
                                    {item.value && <p className="text-sm font-medium text-muted-foreground">{item.value}</p>}
                                </div>
                            </div>
                            {item.onClick && (
                                <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                            )}
                        </motion.button>
                    ))}

                    <motion.button
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: menuItems.length * 0.06 }}
                        onClick={handleLogout}
                        className="bg-red-50 p-6 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-between group text-left md:col-span-2"
                    >
                        <div className="flex items-center gap-4 text-red-600">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white text-red-500 shadow-sm">
                                <LogOut size={20} />
                            </div>
                            <h3 className="font-bold text-lg">Log Out</h3>
                        </div>
                        <ChevronRight className="text-red-400 group-hover:translate-x-1 transition-transform" size={20} />
                    </motion.button>
                </div>

                {/* Recent Orders Section */}
                <div id="orders-section">
                    <h2 className="text-2xl font-black tracking-tight mb-4">Recent Orders</h2>
                    {loadingOrders ? (
                        <div className="flex gap-2 py-8 justify-center">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-border/50 p-12 text-center shadow-sm">
                            <Package size={48} className="mx-auto text-muted-foreground/40 mb-4" strokeWidth={1.5} />
                            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                            <p className="text-muted-foreground mb-6">Browse our marketplace and place your first order!</p>
                            <Button onClick={() => navigate('/marketplace')} className="rounded-full px-8 h-12 shadow-lg shadow-primary/20">
                                Shop Now
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, idx) => {
                                const orderTotal = order.total || order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
                                const orderDate = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                                        className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-muted/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                    <Package size={18} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">Order #{String(order.id).slice(-8)}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                                        <Clock size={11} /> {orderDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold mb-1">Delivered</Badge>
                                                <p className="text-lg font-black text-primary">${orderTotal.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        {order.items?.length > 0 && (
                                            <div className="p-5 space-y-3">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-muted-foreground">× {item.quantity}</span>
                                                        </div>
                                                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
