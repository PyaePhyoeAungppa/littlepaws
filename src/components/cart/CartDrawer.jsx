import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, useCartItemCount, useCartTotal } from '../../lib/store';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
    const { items, removeItem, updateQuantity } = useCartStore();
    const totalItems = useCartItemCount();
    const totalPrice = useCartTotal();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="relative p-2.5 rounded-full border-2 border-border bg-white hover:border-primary hover:bg-primary/5 transition-all group">
                    <ShoppingCart size={20} className="text-foreground group-hover:text-primary transition-colors" />
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.span
                                key="badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-primary text-white text-[11px] font-black shadow-lg border-2 border-white"
                            >
                                {totalItems > 99 ? '99+' : totalItems}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l z-50 p-0">
                <SheetHeader className="px-6 py-5 border-b bg-white">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-black">
                        <ShoppingCart className="text-primary" /> Your Cart
                        {totalItems > 0 && (
                            <span className="ml-auto text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 py-20">
                            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center">
                                <ShoppingCart size={40} strokeWidth={1.5} className="opacity-40" />
                            </div>
                            <p className="font-bold text-lg">Your cart is empty</p>
                            <p className="text-sm text-center max-w-[200px]">Browse our marketplace and add some items!</p>
                            <Button onClick={() => { setOpen(false); navigate('/marketplace'); }} className="rounded-full px-6" variant="outline">
                                Go Shopping →
                            </Button>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors"
                                >
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={e => { e.target.src = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=🐾'; }}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <h4 className="font-bold line-clamp-1">{item.name}</h4>
                                            <p className="text-primary font-black text-lg">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-white rounded-xl border px-2 py-1 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                                                >
                                                    <Minus size={13} />
                                                </button>
                                                <span className="text-sm font-black w-5 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                                                >
                                                    <Plus size={13} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="px-6 pt-4 pb-8 border-t bg-white space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-bold">Subtotal</span>
                            <span className="text-3xl font-black text-primary">${totalPrice.toFixed(2)}</span>
                        </div>
                        <Button
                            className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
                            onClick={() => { setOpen(false); navigate('/checkout'); }}
                        >
                            Checkout — ${totalPrice.toFixed(2)}
                        </Button>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors font-medium text-center"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
