import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getUsers } from "./get-users"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
