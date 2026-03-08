import React, { useState, useEffect } from 'react';
import { fetchFromMock, writeMock } from '../../api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Plus, Pencil, Trash2, Package, DollarSign, TrendingUp, ShoppingBag,
    Calendar, Tag, Star, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

const salesData = [
    { month: 'Oct', sales: 620 }, { month: 'Nov', sales: 850 }, { month: 'Dec', sales: 1400 },
    { month: 'Jan', sales: 980 }, { month: 'Feb', sales: 1100 }, { month: 'Mar', sales: 1240 },
];

const EMPTY_PRODUCT = { name: '', price: '', category: '', description: '', image: '' };
const EMPTY_PROMO = { title: '', discount: '', code: '', expires: '', description: '', badge: 'Hot Deal' };

export default function MerchantDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [promoForm, setPromoForm] = useState(EMPTY_PROMO);
    const [isPromoOpen, setIsPromoOpen] = useState(false);

    const loadAll = () => {
        fetchFromMock('products').then(d => d && setProducts(d));
        fetchFromMock('orders').then(d => d && setOrders(d));
        fetchFromMock('appointments').then(d => d && setAppointments(d));
        fetchFromMock('promotions').then(d => d && setPromotions(d));
    };

    useEffect(() => { loadAll(); }, []);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Product CRUD
    const handleProductSubmit = async (e, type) => {
        e.preventDefault();
        const payload = { ...productForm, price: parseFloat(productForm.price), shopId: '1' };
        const method = type === 'ADD' ? 'POST' : 'PUT';
        const id = type === 'ADD' ? null : editingProduct.id;
        await writeMock('products', method, payload, id);
        loadAll();
        setProductForm(EMPTY_PRODUCT);
        type === 'ADD' ? setIsAddOpen(false) : setIsEditOpen(false);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        await writeMock('products', 'DELETE', null, id);
        loadAll();
    };

    const openEditProduct = (p) => { setEditingProduct(p); setProductForm(p); setIsEditOpen(true); };

    // Promo CRUD
    const handlePromoSubmit = async (e) => {
        e.preventDefault();
        await writeMock('promotions', 'POST', { ...promoForm, id: Date.now().toString(), discount: parseFloat(promoForm.discount) });
        loadAll();
        setIsPromoOpen(false);
        setPromoForm(EMPTY_PROMO);
    };

    const handleDeletePromo = async (id) => {
        await writeMock('promotions', 'DELETE', null, id);
        loadAll();
    };

    const inputCls = "h-12 rounded-xl bg-muted/40 border-none";
    const statCards = [
        { icon: <DollarSign size={22} />, label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-primary bg-primary/10' },
        { icon: <Package size={22} />, label: 'Products', value: products.length, color: 'text-teal-600 bg-teal-50' },
        { icon: <ShoppingBag size={22} />, label: 'Orders', value: orders.length, color: 'text-violet-600 bg-violet-50' },
        { icon: <Calendar size={22} />, label: 'Appointments', value: appointments.length, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <div className="container max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-6 animate-in fade-in duration-500 pb-36 md:pb-16">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight">Merchant Dashboard</h1>
                    <p className="text-muted-foreground text-sm">Welcome back, Admin 👋</p>
                </div>
                <span className="hidden sm:inline text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map(({ icon, label, value, color }) => (
                    <Card key={label} className="border-none shadow-xl shadow-black/5 rounded-3xl">
                        <CardContent className="p-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                                {icon}
                            </div>
                            <p className="text-sm font-bold text-muted-foreground mb-1">{label}</p>
                            <h3 className="text-3xl font-black">{value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sales Chart */}
            <Card className="border-none shadow-xl shadow-black/5 rounded-3xl mb-8">
                <CardHeader>
                    <CardTitle className="text-xl font-black flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(15,100%,70%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(15,100%,70%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                            <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="sales" stroke="hsl(15,100%,70%)" strokeWidth={3} fill="url(#salesGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="products">
                {/* Scrollable tab bar for mobile */}
                <div className="overflow-x-auto pb-1 mb-6 md:mb-8">
                    <TabsList className="bg-muted/50 p-1 rounded-2xl h-12 border gap-1 flex w-max min-w-full md:w-fit">
                        {[['products', 'Products', <Package size={14} />], ['orders', 'Orders', <ShoppingBag size={14} />], ['appointments', 'Appts', <Calendar size={14} />], ['promotions', 'Promos', <Tag size={14} />]].map(([val, label, icon]) => (
                            <TabsTrigger key={val} value={val}
                                className="px-4 md:px-6 h-full rounded-xl font-bold flex items-center gap-1.5 text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all whitespace-nowrap">
                                {icon} {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Products Tab */}
                <TabsContent value="products">
                    <Card className="rounded-[2rem] border-none shadow-xl shadow-black/5 overflow-hidden">
                        <div className="p-4 md:p-8 flex justify-between items-center border-b bg-white gap-3">
                            <h2 className="text-lg md:text-2xl font-bold">Products <span className="text-muted-foreground text-sm font-normal">({products.length})</span></h2>
                            <div className="flex gap-2">
                                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="rounded-full font-bold shadow-lg shadow-primary/20 gap-1.5"><Plus size={14} /> Add</Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-3xl p-6 sm:max-w-md">
                                        <DialogHeader><DialogTitle className="text-2xl font-black">Add Product</DialogTitle></DialogHeader>
                                        <form onSubmit={e => handleProductSubmit(e, 'ADD')} className="space-y-4 mt-4">
                                            <Input placeholder="Product name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required className={inputCls} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input type="number" step="0.01" placeholder="Price ($)" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required className={inputCls} />
                                                <Input placeholder="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required className={inputCls} />
                                            </div>
                                            <Input placeholder="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className={inputCls} />
                                            <textarea placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full rounded-xl bg-muted/40 border-0 resize-none p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" />
                                            <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">Save Product</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                    <DialogContent className="rounded-3xl p-6 sm:max-w-md">
                                        <DialogHeader><DialogTitle className="text-2xl font-black">Edit Product</DialogTitle></DialogHeader>
                                        <form onSubmit={e => handleProductSubmit(e, 'EDIT')} className="space-y-4 mt-4">
                                            <Input placeholder="Product name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required className={inputCls} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input type="number" step="0.01" placeholder="Price ($)" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required className={inputCls} />
                                                <Input placeholder="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required className={inputCls} />
                                            </div>
                                            <Input placeholder="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className={inputCls} />
                                            <textarea placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full rounded-xl bg-muted/40 border-0 resize-none p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" />
                                            <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">Update Product</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Mobile card list */}
                        <div className="md:hidden divide-y">
                            {products.map(p => (
                                <div key={p.id} className="flex items-center gap-3 p-4 hover:bg-muted/20">
                                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-muted shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.category}</p>
                                        <p className="font-black text-primary">${parseFloat(p.price).toFixed(2)}</p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" onClick={() => openEditProduct(p)} className="hover:bg-primary/10 hover:text-primary rounded-full w-8 h-8"><Pencil size={14} /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="hover:bg-destructive/10 hover:text-destructive rounded-full w-8 h-8"><Trash2 size={14} /></Button>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && <p className="text-center py-12 text-muted-foreground text-sm">No products yet.</p>}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-muted/20">
                                        <TableHead className="py-4 font-bold">Product</TableHead>
                                        <TableHead className="font-bold">Category</TableHead>
                                        <TableHead className="font-bold text-right">Price</TableHead>
                                        <TableHead className="font-bold text-right pr-8">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map(p => (
                                        <TableRow key={p.id} className="group border-b hover:bg-muted/20 transition-colors">
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-muted" />
                                                    <div>
                                                        <p className="font-bold">{p.name}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{p.description}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary" className="font-bold rounded-lg">{p.category}</Badge></TableCell>
                                            <TableCell className="text-right font-black text-lg">${parseFloat(p.price).toFixed(2)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditProduct(p)} className="hover:bg-primary/10 hover:text-primary rounded-full"><Pencil size={16} /></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="hover:bg-destructive/10 hover:text-destructive rounded-full"><Trash2 size={16} /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {products.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No products yet. Add your first product!</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                    <Card className="rounded-[2rem] border-none shadow-xl shadow-black/5 overflow-hidden">
                        <div className="p-4 md:p-8 border-b bg-white">
                            <h2 className="text-lg md:text-2xl font-bold">Orders <span className="text-muted-foreground text-sm font-normal">({orders.length})</span></h2>
                        </div>
                        {/* Mobile cards */}
                        <div className="md:hidden divide-y">
                            {orders.map(o => (
                                <div key={o.id} className="p-4 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-mono text-xs text-muted-foreground mb-1">#{o.id?.slice(-8)}</p>
                                        <p className="font-bold text-sm">{o.items?.length || 0} items</p>
                                        <p className="text-xs text-muted-foreground">{o.date ? new Date(o.date).toLocaleDateString() : '—'}</p>
                                    </div>
                                    <span className="font-black text-primary text-lg">${(o.total || 0).toFixed(2)}</span>
                                </div>
                            ))}
                            {orders.length === 0 && <p className="text-center py-12 text-muted-foreground text-sm">No orders yet.</p>}
                        </div>
                        {/* Desktop table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-muted/20">
                                        <TableHead className="py-4 pl-6 font-bold">Order ID</TableHead>
                                        <TableHead className="font-bold">Date</TableHead>
                                        <TableHead className="font-bold">Items</TableHead>
                                        <TableHead className="font-bold text-right pr-8">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map(o => (
                                        <TableRow key={o.id} className="border-b hover:bg-muted/20">
                                            <TableCell className="py-4 pl-6 font-mono text-xs text-muted-foreground">#{o.id?.slice(-8)}</TableCell>
                                            <TableCell>{o.date ? new Date(o.date).toLocaleDateString() : '—'}</TableCell>
                                            <TableCell><div className="flex items-center gap-1"><span className="font-bold">{o.items?.length || 0}</span><span className="text-muted-foreground text-sm">items</span></div></TableCell>
                                            <TableCell className="text-right pr-8 font-black text-primary">${(o.total || 0).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {orders.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No orders yet.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments">
                    <Card className="rounded-[2rem] border-none shadow-xl shadow-black/5 overflow-hidden">
                        <div className="p-4 md:p-8 border-b bg-white">
                            <h2 className="text-lg md:text-2xl font-bold">Appointments <span className="text-muted-foreground text-sm font-normal">({appointments.length})</span></h2>
                        </div>
                        {/* Mobile cards */}
                        <div className="md:hidden divide-y">
                            {appointments.map(a => (
                                <div key={a.id} className="p-4 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-sm">{a.serviceName || `Service #${a.serviceId}`}</p>
                                        <p className="text-xs text-muted-foreground">{a.date ? new Date(a.date).toLocaleDateString() : a.date} · {a.time}</p>
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold rounded-lg gap-1 shrink-0"><Clock size={11} /> Pending</Badge>
                                </div>
                            ))}
                            {appointments.length === 0 && <p className="text-center py-12 text-muted-foreground text-sm">No appointments yet.</p>}
                        </div>
                        {/* Desktop table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-muted/20">
                                        <TableHead className="py-4 pl-6 font-bold">Service</TableHead>
                                        <TableHead className="font-bold">Pet Name</TableHead>
                                        <TableHead className="font-bold">Date & Time</TableHead>
                                        <TableHead className="font-bold text-right pr-8">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map(a => (
                                        <TableRow key={a.id} className="border-b hover:bg-muted/20">
                                            <TableCell className="py-4 pl-6 font-bold">{a.serviceName || `Service #${a.serviceId}`}</TableCell>
                                            <TableCell className="text-muted-foreground">{a.petName || '—'}</TableCell>
                                            <TableCell><div><p className="font-bold">{a.date ? new Date(a.date).toLocaleDateString() : a.date}</p><p className="text-xs text-muted-foreground">{a.time}</p></div></TableCell>
                                            <TableCell className="text-right pr-8"><Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold rounded-lg gap-1"><Clock size={12} /> Pending</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                    {appointments.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No appointments yet.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                {/* Promotions Tab */}
                <TabsContent value="promotions">
                    <Card className="rounded-[2rem] border-none shadow-xl shadow-black/5 overflow-hidden">
                        <div className="p-8 flex justify-between items-center border-b bg-white">
                            <h2 className="text-2xl font-bold">Promotions & Hot Deals</h2>
                            <Dialog open={isPromoOpen} onOpenChange={setIsPromoOpen}>
                                <DialogTrigger asChild>
                                    <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 gap-2"><Plus size={16} /> New Promotion</Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-3xl p-8 sm:max-w-md">
                                    <DialogHeader><DialogTitle className="text-2xl font-black">Create Promotion</DialogTitle></DialogHeader>
                                    <form onSubmit={handlePromoSubmit} className="space-y-4 mt-4">
                                        <Input placeholder="Promotion title (e.g. Summer Sale)" value={promoForm.title} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} required className={inputCls} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input type="number" placeholder="Discount %" value={promoForm.discount} onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })} required className={inputCls} />
                                            <Input placeholder="Code (e.g. SAVE20)" value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} className={inputCls} />
                                        </div>
                                        <Input placeholder="Badge label (e.g. Hot Deal)" value={promoForm.badge} onChange={e => setPromoForm({ ...promoForm, badge: e.target.value })} className={inputCls} />
                                        <Input type="date" placeholder="Expiry date" value={promoForm.expires} onChange={e => setPromoForm({ ...promoForm, expires: e.target.value })} className={inputCls} />
                                        <textarea placeholder="Description (optional)" value={promoForm.description} onChange={e => setPromoForm({ ...promoForm, description: e.target.value })} className="w-full rounded-xl bg-muted/40 border-0 resize-none p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" />
                                        <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">Create Promotion</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {promotions.map(promo => (
                                <div key={promo.id} className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 border rounded-2xl p-6 relative group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <Badge className="mb-2 bg-primary text-white border-none font-bold">{promo.badge || 'Promotion'}</Badge>
                                            <h3 className="font-black text-xl">{promo.title}</h3>
                                        </div>
                                        <div className="text-4xl font-black text-primary">{promo.discount}%<span className="text-sm font-bold text-muted-foreground"> OFF</span></div>
                                    </div>
                                    {promo.description && <p className="text-muted-foreground text-sm mb-3">{promo.description}</p>}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {promo.code && <span className="font-mono bg-white border rounded-lg px-3 py-1 text-sm font-bold">{promo.code}</span>}
                                            {promo.expires && <span className="text-xs text-muted-foreground">Expires {new Date(promo.expires).toLocaleDateString()}</span>}
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeletePromo(promo.id)} className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive rounded-full transition-all">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {promotions.length === 0 && (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    <Tag size={48} strokeWidth={1.5} className="mx-auto mb-4 text-muted-foreground/50" />
                                    <p>No promotions yet. Create your first deal!</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
