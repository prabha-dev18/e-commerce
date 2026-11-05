import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      compare: [],
      recent: [],
      coupon: null,
      cartOpen: false,
      menuOpen: false,
      searchOpen: false,

      addToCart: (product, qty = 1, variant = null) =>
        set((s) => {
          const key = `${product.id}:${variant || ''}`;
          const found = s.cart.find((i) => i.key === key);
          const cart = found
            ? s.cart.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
            : [...s.cart, { key, id: product.id, slug: product.slug || product.id, name: product.name, price: product.price, image: product.image || null, variant, qty }];
          return { cart, cartOpen: true };
        }),
      setQty: (key, qty) =>
        set((s) => ({ cart: qty < 1 ? s.cart.filter((i) => i.key !== key) : s.cart.map((i) => (i.key === key ? { ...i, qty } : i)) })),
      removeFromCart: (key) => set((s) => ({ cart: s.cart.filter((i) => i.key !== key) })),
      clearCart: () => set({ cart: [], coupon: null }),

      toggleWishlist: (id) =>
        set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),
      toggleCompare: (id) =>
        set((s) => ({
          compare: s.compare.includes(id) ? s.compare.filter((x) => x !== id) : s.compare.length < 4 ? [...s.compare, id] : s.compare,
        })),

      pushRecent: (id) => set((s) => ({ recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 10) })),
      setCoupon: (coupon) => set({ coupon }),
      clearWishlist: () => set({ wishlist: [] }),

      setCartOpen: (v) => set({ cartOpen: v }),
      setMenuOpen: (v) => set({ menuOpen: v }),
      setSearchOpen: (v) => set({ searchOpen: v }),

      cartCount: () => get().cart.reduce((n, i) => n + i.qty, 0),
      cartTotal: () => get().cart.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    {
      name: 'lumiere-store',
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, compare: s.compare, recent: s.recent, coupon: s.coupon }),
      skipHydration: true,
    }
  )
);
