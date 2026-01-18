# Project: NextJS Torent Rental Logic

## Goal
Implement vehicle availability logic to prevent double-booking of currently rented vehicles.

## Vetted Dependencies
- **date-fns** (Existing) — Robust date manipulation for checking rental periods.
- **drizzle-orm** (Existing) — Type-safe SQL builder for querying order overlaps.

## Structure
```
.
├── src/
│   ├── app/
│   │   ├── (user)/(rent)/dashboard/browse-vehicles/
│   │   │   └── page.tsx        # UI updates: Show availability status, disable booked cars
│   │   └── api/
│   │       └── cars/
│   │           └── route.ts    # Backend: Inject `isAvailable` flag by checking active orders
│   └── db/
│       └── order-schema.ts     # DB: Add indices on startDate/endDate for performance
```

## Implementation Details
1.  **Availability Logic**:
    - A vehicle is **unavailable** if there exists an `order_item` where:
        - `product_id` matches the vehicle.
        - The associated `order` status is `confirmed` or `active`.
        - The current date overlaps with `[start_date, end_date]`.
2.  **API Response**:
    - Extend the vehicle object with `isAvailable: boolean` and optional `availableFrom: Date`.

## Security
- **Race Condition Prevention**: Availability must be re-checked strictly at the moment of order creation (checkout), not just during browsing.
- **Input Sanitization**: Ensure date comparisons use server-side time to prevent client-clock manipulation.

## Lint
```bash
npm run lint
```
