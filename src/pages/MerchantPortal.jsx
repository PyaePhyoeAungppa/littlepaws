import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Package, Plus, Search, MoreVertical, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchFromMock } from '../api/client';

export function MerchantLogin() {
    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 bg-muted/30 px-6">
            <Card className="max-w-md w-full p-10 border-none shadow-2xl rounded-[2.5rem] bg-white text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary">
                    <Package size={40} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-black mb-2 tracking-tight">Merchant Portal</h1>
                <p className="text-muted-foreground mb-10">Sign in to manage your pet store and products.</p>

                <div className="space-y-4 text-left">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                        <Input type="email" placeholder="admin@littlepaws.com" defaultValue="admin@littlepaws.com" className="h-14 rounded-2xl border-none bg-muted shadow-inner px-6 font-medium focus-visible:ring-primary/20" />
                    </div>
                    <div className="space-y-2 px-1">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                        <Input type="password" placeholder="••••••••" defaultValue="password" className="h-14 rounded-2xl border-none bg-muted shadow-inner px-6 font-medium focus-visible:ring-primary/20" />
                    </div>
                </div>

                <Button
                    className="w-full h-16 mt-10 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-primary/20 transition-transform active:scale-95"
                    onClick={() => window.location.href = '/merchant/dashboard'}
                >
                    Sign In
                </Button>
                <p className="mt-8 text-sm text-muted-foreground font-medium">Don't have a store? <span className="text-primary hover:underline cursor-pointer">Register Shop</span></p>
            </Card>
        </div>
    );
}

export function MerchantDashboard() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchFromMock('products').then(data => data && setProducts(data));
    }, []);

    const stats = [
        { label: 'Total Earnings', value: '$12,482.00', icon: <LayoutDashboard size={20} />, color: 'bg-primary' },
        { label: 'Total Orders', value: '142', icon: <ShoppingBag size={20} />, color: 'bg-secondary' },
        { label: 'Active Products', value: '24', icon: <Package size={20} />, color: 'bg-accent' },
    ];

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            <header className="bg-white border-b py-8 sticky top-0 md:static z-30">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                            <Package size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight leading-none mb-1">Store Dashboard</h1>
                            <p className="text-muted-foreground text-sm font-medium">Managing: <span className="text-primary">LittlePaws Official</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl border-2 font-bold flex items-center gap-2">
                            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                        </Button>
                        <Button className="rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/15">
                            <Plus size={20} /> Add Product
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {stats.map(stat => (
                        <Card key={stat.label} className="border-none shadow-xl shadow-black/5 rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-[1.25rem] ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                                    <h2 className="text-3xl font-black tracking-tighter leading-none">{stat.value}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Product Management Table */}
                <Card className="border-none shadow-2xl shadow-black/5 rounded-[2.5rem] bg-white overflow-hidden p-8 md:p-12">
                    <CardHeader className="px-0 pt-0 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight mb-2">Inventory Management</CardTitle>
                            <CardDescription className="text-base text-muted-foreground font-medium italic">Track and update your listed products across the platform.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <Input placeholder="Search inventory..." className="h-12 pl-12 rounded-xl border-none bg-muted px-6 font-medium focus-visible:ring-primary/20" />
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-muted/50 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    <th className="pb-6">Product</th>
                                    <th className="pb-6">Category</th>
                                    <th className="pb-6 text-right">Price</th>
                                    <th className="pb-6 text-right">Stock</th>
                                    <th className="pb-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted">
                                {products.map(product => (
                                    <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="py-6 pr-4">
                                            <div className="flex items-center gap-4">
                                                <img src={product.image} className="w-16 h-16 rounded-2xl object-cover shrink-0" alt="" />
                                                <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <Badge variant="outline" className="rounded-lg font-bold uppercase text-[10px] tracking-widest px-3 py-1 bg-muted/20 border-muted-foreground/10">{product.category}</Badge>
                                        </td>
                                        <td className="py-6 text-right">
                                            <span className="font-black text-xl text-secondary-foreground/80">${product.price}</span>
                                        </td>
                                        <td className="py-6 text-right">
                                            <span className="font-bold text-muted-foreground">12 Units</span>
                                        </td>
                                        <td className="py-6 text-right">
                                            <Button variant="ghost" size="icon" className="rounded-lg hover:bg-primary/10 hover:text-primary">
                                                <MoreVertical size={20} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
}
