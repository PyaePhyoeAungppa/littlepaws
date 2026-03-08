import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => {
                const existingItem = state.items.find((item) => item.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        ),
                    };
                }
                return { items: [...state.items, { ...product, quantity: 1 }] };
            }),
            removeItem: (productId) => set((state) => ({
                items: state.items.filter((item) => item.id !== productId),
            })),
            updateQuantity: (productId, quantity) => set((state) => ({
                items: state.items.map((item) =>
                    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                ),
            })),
            clearCart: () => set({ items: [] }),
            // Computed as plain selectors (not getters) so Zustand tracks them reactively
            totalItems: 0,
            totalPrice: 0,
        }),
        {
            name: 'littlepaws-cart',
        }
    )
);

// Selector hooks — these are reactive and will trigger re-renders
export const useCartItemCount = () =>
    useCartStore((state) => state.items.reduce((t, i) => t + i.quantity, 0));

export const useCartTotal = () =>
    useCartStore((state) => state.items.reduce((t, i) => t + i.price * i.quantity, 0));
