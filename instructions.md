# Project: NextJS Torent Cart Enhancement
## Goal
Enable users to customize rental duration, start date, and pricing model (Daily/Weekly/Monthly) directly in the shopping cart.

## Vetted Dependencies
- date-fns@^4.0.0 — Existing project dependency for robust date manipulation.
- lucide-react@^0.400.0 — Existing project dependency for UI icons.
- zustand@^5.0.0 — Existing state management for cart logic.

## Structure
```
.
├── src
│   ├── app
│   │   └── (user)
│   │       └── (rent)
│   │           └── dashboard
│   │               ├── browse-vehicles
│   │               │   └── page.tsx      # Update: Pass available prices to cart
│   │               └── cart
│   │                   └── page.tsx      # Update: Add editing controls (Date, Qty, Type)
│   ├── lib
│   │   └── stores
│   │       └── cart-store.ts             # Update: Add updateItem action
│   └── types
│       └── cart.ts                       # Update: Add availablePrices to CartItem
```

## Security
- **Input Validation**: Ensure `startDate` is not in the past.
- **Type Safety**: Enforce strictly typed pricing models (Daily/Weekly/Monthly) to prevent invalid pricing logic.
- **Sanitization**: Ensure `quantity` is a positive integer > 0 to prevent negative billing.

## Lint
```bash
npm run lint
```
