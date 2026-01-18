import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartState, CartItem } from "@/types/cart";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) => {
        const currentItems = get().items;
        // Check if item already exists (same product, same pricing, same dates)
        // For simplicity, we'll just check product and pricing type. 
        // A more complex implementation might merge quantities or treat different dates as different items.
        // Here we'll treat unique combination of product + pricing + start + end as unique item.
        const existingItemIndex = currentItems.findIndex(
          (i) =>
            i.product.id === item.product.id &&
            i.pricingTypeId === item.pricingTypeId &&
            i.startDate.getTime() === item.startDate.getTime() &&
            i.endDate.getTime() === item.endDate.getTime()
        );

        if (existingItemIndex > -1) {
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += item.quantity;
          set({ items: newItems });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      updateItem: (itemId: string, updates: Partial<CartItem>) => {
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        });
      },
      removeItem: (itemId: string) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },
      clearCart: () => {
        set({ items: [] });
      },
      total: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: "torent-cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Need to handle Date objects deserialization if necessary, 
      // but standard JSON.stringify turns dates to strings.
      // We might need a custom storage or onRehydrate to parse dates back.
      // For now, let's keep it simple. Components might need to re-parse dates.
      onRehydrateStorage: () => (state) => {
        if (state) {
            // Convert string dates back to Date objects
            state.items = state.items.map(item => ({
                ...item,
                startDate: new Date(item.startDate),
                endDate: new Date(item.endDate)
            }));
        }
      }
    }
  )
);
