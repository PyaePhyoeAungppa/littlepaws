import React, { useState } from 'react';
import { useCartStore } from '../lib/store';
import { writeMock } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, CreditCard, Package, Lock, CheckCircle } from 'lucide-react';

function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(value) {
    return value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
}

export default function Checkout() {
    const { items, totalPrice, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1=shipping, 2=payment
    const [submitting, setSubmitting] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    const handleShippingNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const newOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            total: totalPrice,
            items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price }))
        };
        try {
            await writeMock('orders', 'POST', newOrder);
            clearCart();
            setStep(3);
        } catch (err) {
            console.error('Checkout failed', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0 && step !== 3) {
        return (
            <div className="container py-20 text-center flex flex-col items-center">
                <ShoppingBag size={64} className="text-muted-foreground mb-6" strokeWidth={1.5} />
                <h2 className="text-3xl font-black mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate('/marketplace')} className="rounded-full px-8 h-12">Return to Shop</Button>
            </div>
        );
    }

    // Success Screen
    if (step === 3) {
        return (
            <div className="container py-20 text-center flex flex-col items-center gap-6 max-w-lg mx-auto">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                    <CheckCircle size={52} className="text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-black mb-3 tracking-tight">Order Placed!</h2>
                    <p className="text-muted-foreground text-lg">Thank you for your purchase. Your order is being processed and will be delivered soon.</p>
                </div>
                <div className="bg-muted/30 rounded-2xl p-6 w-full text-left space-y-3 mt-2">
                    <p className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-4">Order Summary</p>
                    {[...items].slice(0, 3).map(item => (
                        <div key={item.id} className="flex justify-between text-sm font-medium">
                            <span>{item.name} ×{item.quantity}</span>
                            <span className="font-black">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    {items.length > 3 && <p className="text-muted-foreground text-sm">+{items.length - 3} more items</p>}
                </div>
                <Button onClick={() => navigate('/')} className="rounded-full px-10 h-14 text-lg font-black shadow-xl shadow-primary/30 w-full">
                    Back to Home
                </Button>
            </div>
        );
    }

    const inputClass = "h-14 rounded-xl bg-muted/30 border-none shadow-inner text-base";

    return (
        <div className="container max-w-6xl mx-auto py-12 px-6">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-10">
                {[{ n: 1, label: 'Shipping', icon: <Package size={16} /> }, { n: 2, label: 'Payment', icon: <CreditCard size={16} /> }].map(({ n, label, icon }) => (
                    <React.Fragment key={n}>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${step >= n ? 'bg-primary text-white shadow-primary/30 shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                            {icon} {label}
                        </div>
                        {n < 2 && <div className={`h-0.5 flex-1 rounded-full transition-all ${step > n ? 'bg-primary' : 'bg-muted'}`} />}
                    </React.Fragment>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Shipping */}
                    {step === 1 && (
                        <Card className="rounded-[2rem] border-none shadow-xl shadow-black/5">
                            <CardHeader className="bg-muted/30 pb-6 border-b rounded-t-[2rem] px-8 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                        <Package size={20} className="text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-black">Shipping Information</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 px-8 pb-8">
                                <form id="shipping-form" onSubmit={handleShippingNext} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="font-bold">First Name</Label>
                                            <Input required placeholder="John" className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">Last Name</Label>
                                            <Input required placeholder="Doe" className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Email Address</Label>
                                        <Input required type="email" placeholder="john@example.com" className={inputClass} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Street Address</Label>
                                        <Input required placeholder="123 Paws Lane" className={inputClass} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="font-bold">City</Label>
                                            <Input required placeholder="Paws City" className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">ZIP Code</Label>
                                            <Input required placeholder="12345" className={inputClass} />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 mt-2">
                                        Continue to Payment →
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <Card className="rounded-[2rem] border-none shadow-xl shadow-black/5">
                            <CardHeader className="bg-muted/30 pb-6 border-b rounded-t-[2rem] px-8 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                        <CreditCard size={20} className="text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-black">Payment Details</CardTitle>
                                    <div className="ml-auto flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                                        <Lock size={12} /> SSL Secured
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 px-8 pb-8">
                                {/* Card preview */}
                                <div className="relative bg-gradient-to-br from-primary to-primary/70 rounded-3xl p-6 text-white mb-8 overflow-hidden shadow-2xl shadow-primary/30">
                                    <div className="absolute top-4 right-6 text-4xl opacity-20 font-black tracking-widest">VISA</div>
                                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Card Number</p>
                                    <p className="text-xl font-black tracking-widest mb-6">
                                        {cardNumber || '•••• •••• •••• ••••'}
                                    </p>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-white/60 text-[10px] uppercase tracking-widest">Card Holder</p>
                                            <p className="font-bold">{cardName || 'YOUR NAME'}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-[10px] uppercase tracking-widest">Expires</p>
                                            <p className="font-bold">{expiry || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>

                                <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="font-bold">Name on Card</Label>
                                        <Input required placeholder="John Doe" value={cardName}
                                            onChange={e => setCardName(e.target.value)} className={inputClass} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Card Number</Label>
                                        <Input required placeholder="1234 5678 9012 3456"
                                            value={cardNumber}
                                            onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                            maxLength={19} className={inputClass} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Expiry Date</Label>
                                            <Input required placeholder="MM/YY"
                                                value={expiry}
                                                onChange={e => setExpiry(formatExpiry(e.target.value))}
                                                maxLength={5} className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">CVV</Label>
                                            <Input required placeholder="•••" type="password"
                                                value={cvv}
                                                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                className={inputClass} />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl font-bold border-2">
                                            ← Back
                                        </Button>
                                        <Button type="submit" disabled={submitting} className="flex-1 h-14 rounded-2xl font-black text-base shadow-xl shadow-primary/20">
                                            {submitting ? 'Processing…' : '🔒 Pay Now'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Order Summary sidebar */}
                <div>
                    <Card className="rounded-[2rem] sticky top-24 border-none shadow-xl shadow-black/5 bg-primary/5">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-black">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary font-black bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">{item.quantity}</span>
                                        <span className="font-bold text-sm line-clamp-1 max-w-[110px]">{item.name}</span>
                                    </div>
                                    <span className="font-black text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}

                            <div className="border-t-2 border-primary/10 pt-4 mt-2 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="text-emerald-600 font-bold">Free</span></div>
                                <div className="flex justify-between text-xl font-black mt-2 pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-4 mt-4">
                                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                                    <Lock size={12} /> Your payment is securely encrypted
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
