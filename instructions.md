# Project: NextJS Torent - Soft Delete Implementation

## Goal
Implement "Soft Delete" for vehicles (products) to allow "deletion" without breaking historical order data due to foreign key constraints.

## Strategy
Instead of physically removing rows from the database, we will introduce a `deleted_at` timestamp column.
- **Active Records:** `deleted_at` is NULL.
- **Deleted Records:** `deleted_at` has a timestamp.

## Schema Changes
### `src/db/product-schema.ts`
- Add `deletedAt: timestamp("deleted_at")` to the `products` table definition.

## Application Logic Changes
1.  **Backend (API) - `src/app/api/cars/[id]/route.ts`**:
    -   **Delete Action:** Replace SQL `DELETE` with `UPDATE products SET deleted_at = NOW() WHERE id = ?`.
    -   Ensure the API returns a success response indicating the item was archived/soft-deleted.

2.  **Backend (API) - `src/app/api/cars/route.ts`**:
    -   **List Action:** Update the GET query to include `.where(isNull(products.deletedAt))` to exclude deleted items from the list.

3.  **Frontend - `src/app/(admin)/admin/(management)/cars/page.tsx`**:
    -   **Delete Logic:** The current `handleDelete` logic optimistically removes the item from the UI state (`setCars`). This is correct for soft delete.
    -   **Enhancement:** Verify that the UI correctly handles the response. No major logic change needed if the API returns 200 OK, but we will review to ensure it feels seamless.

4.  **Order History**:
    -   No changes required. Historical orders will still reference the product ID. Since the row is not physically deleted, all joins and foreign keys remain valid.

## Security & Integrity
- Ensures Referential Integrity (Foreign Keys) remains intact.
- Prevents accidental permanent data loss.
