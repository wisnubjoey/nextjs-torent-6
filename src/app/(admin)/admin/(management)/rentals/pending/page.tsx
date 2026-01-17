import { DataTable } from "./data-table"
import { columns, PendingRental } from "./columns"
import { getPendingRentals } from "./get-pending-rentals"

export default async function PendingRentalsPage() {
  const pendingRentals = await getPendingRentals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Rentals</h1>
        <p className="text-muted-foreground">Manage pending rental requests</p>
      </div>
      <DataTable columns={columns} data={pendingRentals as PendingRental[]} />
    </div>
  );
}
