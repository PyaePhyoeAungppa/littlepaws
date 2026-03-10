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

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],
            toggleItem: (product) => set((state) => {
                const isSaved = state.items.some(item => item.id === product.id);
                if (isSaved) {
                    return { items: state.items.filter(item => item.id !== product.id) };
                }
                return { items: [...state.items, product] };
            }),
            hasItem: (id) => get().items.some(item => item.id === id)
        }),
        {
            name: 'littlepaws-wishlist',
        }
    )
);

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null, // null means not logged in
            login: (userData) => set({ user: userData }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'littlepaws-auth',
        }
    )
);
