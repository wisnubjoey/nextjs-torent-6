# Project: NextJS Torent - Product Schema Expansion (Junction Tables)

## Goal
Implement a relational database structure for `products` using **Junction Tables** to link `brands` and `pricing` configurations. This allows for flexible brand associations and structured pricing tiers (Daily, Weekly, Monthly).

## Vetted Dependencies
- **drizzle-orm** (Existing) — Core ORM for defining relational schemas and junction tables.
- **drizzle-kit** (Existing) — Migration management.
- **zod** (Existing) — Validation for complex relational data inputs.

## Structure
```
/Users/Bjoey/Desktop/Dev/Working/nextjs-torent-6/
├── db/
│   ├── schema.ts         # Define tables: products, brands, pricing_types
│   │                     # Define junctions: product_brands, product_prices
│   └── index.ts          # Export relations
├── drizzle/              # Migrations
└── src/
    └── types/            # Types including relation interfaces
```

## Schema Design
- **Tables**:
  - `products` (id, model_name, image)
  - `brands` (id, name, logo)
  - `pricing_types` (id, name) — *Pre-seeded with: Daily, Weekly, Monthly*
- **Junctions**:
  - `product_brands` (product_id, brand_id)
  - `product_prices` (product_id, pricing_type_id, price)

## Security & Hygiene
- **Referential Integrity**: Use Foreign Keys (`references`) in Drizzle to enforce relationships in junction tables.
- **Composite Keys**: Use composite primary keys in junction tables (e.g., `[productId, brandId]`) to prevent duplicate links.
- **Validation**: Ensure `price` in `product_prices` is a positive number.

## Lint
```bash
npm run lint
```