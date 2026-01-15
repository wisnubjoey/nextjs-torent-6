import { Product } from "./index";

export interface CartItem {
  id: string; // Unique ID for the cart item (can be a combination of product ID and pricing type ID)
  product: Product;
  pricingTypeId: string;
  pricingTypeName: string;
  price: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  days: number; // Duration in days (or relevant unit based on pricing type)
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: () => number;
}
