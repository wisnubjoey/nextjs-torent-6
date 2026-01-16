import { DataTable } from "./data-table"
import { columns, ActiveRental } from "./columns"
import { getActiveRentals } from "./get-active-rentals"

export default async function ActiveRentalsPage() {
  const activeRentals = await getActiveRentals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Rentals</h1>
        <p className="text-muted-foreground">Manage currently active car rentals</p>
      </div>
      <DataTable columns={columns} data={activeRentals as ActiveRental[]} />
    </div>
  );
}
