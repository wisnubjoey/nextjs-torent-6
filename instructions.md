# Project: NextJS Torent - Cart, Checkout & Order History

## Goal
Implement a complete rental checkout flow including a persistent Cart (Zustand), Order/History database schema, and User Dashboard for tracking rentals. Rentals are split between "My Rentals" (active) and "Order History" (completed/cancelled).

## Logic: Active vs. History
- **My Rentals (`/dashboard/my-rentals`)**: 
  - Orders where `status` is 'confirmed' AND at least one item has `endDate >= now`.
  - Orders where `status` is 'pending'.
- **Order History (`/dashboard/orders`)**: 
  - Orders where `status` is 'cancelled'.
  - Orders where `status` is 'confirmed' AND all items have `endDate < now`.
  - Orders where `status` is 'completed'.

## Schema Extensions
- **`orders` table**:
  - `id` (uuid, pk)
  - `userId` (text, fk -> user.id)
  - `status` (enum: pending, confirmed, cancelled, completed)
  - `totalAmount` (double)
  - `createdAt` (timestamp)
- **`order_items` table**:
  - `id` (uuid, pk)
  - `orderId` (uuid, fk -> orders.id)
  - `productId` (uuid, fk -> products.id)
  - `pricingTypeId` (uuid, fk -> pricing_types.id)
  - `quantity` (int)
  - `priceSnapshot` (double) - Store rate at time of booking
  - `startDate` (timestamp)
  - `endDate` (timestamp)

## Security
- **Server-Side Validation**: Re-calculate totals on the backend using `product_prices` to prevent client-side price tampering.
- **Auth Checks**: Ensure `userId` in orders matches the authenticated session.
- **Transaction Support**: Use Drizzle `db.transaction()` to ensure `orders` and `order_items` are created atomically.

## Lint
```bash
npm run lint
```
