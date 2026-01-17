# Project: NextJS Torent Admin Rental Workflow Update
## Goal
Update rental workflow to support Pending -> Confirmed -> Active state transitions and cancellation logic for both admin and user.

## Vetted Dependencies
- None (Uses existing project dependencies: drizzle-orm, @tanstack/react-table, lucide-react, date-fns)

## Structure
```
src/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       └── (management)/
│   │           └── rentals/
│   │               └── pending/
│   │                   ├── actions.ts
│   │                   ├── columns.tsx
│   │                   └── page.tsx
│   └── (user)/
│       └── (rent)/
│           └── dashboard/
│               └── my-rentals/
│                   └── page.tsx
```

## Implementation Details
1.  **Admin Rental Workflow Update**:
    -   **Pending Rentals Page**:
        -   Update "Accept" button action to change status from `Pending` to `Confirmed`.
        -   Add "Cancel" button to change status to `Cancelled`.
        -   Logic: `Pending` -> `Confirmed` (Accept), `Pending` -> `Cancelled` (Cancel).
    -   **Confirmed/Active Logic**:
        -   Admin manually activates `Confirmed` orders to `Active` (e.g., upon key handover).
        -   Need to decide where this activation happens (likely in the same table or a new "Confirmed" tab, but for now, we'll keep it in Pending or move to Active tab with a "Start" action? The prompt says "after button accept clicked, button changes to (activate)". This implies the item might stay in the list or the list needs to show Confirmed items too).
        -   **Refined Plan**: Modify Pending page to show `Pending` AND `Confirmed` items? Or just `Pending`.
        -   *User Instruction Interpretation*: "halaman pending rentals... setelah button accept diclick, button tersebut berubah menjadi (activate). Jadi ubah status dari pending -> confirmed -> active."
        -   This implies the row stays in the view or the view handles both Pending and Confirmed.
        -   Let's update `get-pending-rentals.ts` to fetch `Pending` OR `Confirmed`.
        -   Column logic:
            -   If status is `Pending` -> Show "Accept" (Sets to `Confirmed`) & "Cancel".
            -   If status is `Confirmed` -> Show "Activate" (Sets to `Active` and updates `startDate` to now).

2.  **User My Rentals Update**:
    -   Update filtering logic in `my-rentals/page.tsx`:
        -   Show `Pending`, `Confirmed`, and `Active` orders.
    -   **Start Date Logic**:
        -   The user mentioned: "start date nya dimulai setelah admin mengubah status confirmed menjadi active."
        -   We need to ensure `startDate` in the database is updated when status becomes `Active`.

3.  **Database Updates (Implicit)**:
    -   Ensure `startDate` and `endDate` are adjusted when order becomes Active if necessary (or just `startDate`).

## Security
-   Ensure only admins can perform state transitions.
-   Validate order existence before updating.

## Lint
```bash
npm run lint
```
