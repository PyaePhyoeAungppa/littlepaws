import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useCartItemCount } from '../../lib/store';
import CartDrawer from './CartDrawer';

/**
 * Floating cart button shown only on mobile (md:hidden).
 * Sits above the bottom navigation bar.
 * Opens the same CartDrawer used by the desktop navbar.
 */
export default function FloatingCart() {
    const totalItems = useCartItemCount();
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* FAB — always visible on mobile, hidden on desktop */}
            <AnimatePresence>
                <motion.button
                    onClick={() => setOpen(true)}
                    className="md:hidden fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-95 transition-transform"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    aria-label="Open cart"
                >
                    <ShoppingCart size={22} />
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.span
                                key="fab-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-white text-primary text-[11px] font-black flex items-center justify-center border-2 border-primary shadow"
                            >
                                {totalItems > 99 ? '99+' : totalItems}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </AnimatePresence>

            {/* Reuse the CartDrawer with external open state */}
            <CartDrawer open={open} onOpenChange={setOpen} />
        </>
    );
}
