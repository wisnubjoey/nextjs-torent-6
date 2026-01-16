# Project: Admin Rental Management
## Goal
Implement a dedicated rental management section in the admin dashboard to track "Active" (confirmed) and "History" (completed/cancelled) rentals, including sidebar navigation.

## Logic: Admin View
- **Active Rentals**: Orders where `status` is 'confirmed'.
- **Rental History**: Orders where `status` is 'completed' or 'cancelled'.
- **Pending Approvals**: (Optional/Future) Orders where `status` is 'pending'.

## Vetted Dependencies
- lucide-react @latest — For sidebar icons (List, Clock, Car).

## Structure
```
.
└── src/
    ├── app/
    │   └── (admin)/
    │       └── admin/
    │           └── (management)/
    │               └── rentals/
    │                   ├── active/
    │                   │   └── page.tsx
    │                   └── history/
    │                       └── page.tsx
    └── components/
        └── admin-sidebar.tsx
```

## Security
- **Admin Middleware**: Ensure all routes under `admin/*` verify the user's role is 'admin' via `auth.ts`.
- **Data Integrity**: Use `ordersRelations` to fetch user details (name, email) and joined `order_items` for car model names.

## Lint
```bash
npm run lint
```