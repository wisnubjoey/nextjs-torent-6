import { DataTable } from "./data-table"
import { columns, HistoryRental } from "./columns"
import { getHistoryRentals } from "./get-history-rentals"

export default async function HistoryRentalsPage() {
  const historyRentals = await getHistoryRentals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rental History</h1>
        <p className="text-muted-foreground">View completed and cancelled rentals</p>
      </div>
      <DataTable columns={columns} data={historyRentals as HistoryRental[]} />
    </div>
  );
}
