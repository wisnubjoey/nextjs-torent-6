"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/db/schema"
import { formatCurrency } from "@/lib/utils"

export type ActiveRental = {
  id: string
  status: OrderStatus
  totalAmount: number
  createdAt: Date
  user: {
    name: string
    email: string
  }
  items: {
    product: {
      modelName: string
    }
    startDate: Date
    endDate: Date
  }[]
}

export const columns: ColumnDef<ActiveRental>[] = [
  {
    accessorKey: "user.name",
    header: "Customer",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    id: "car",
    header: "Car",
    cell: ({ row }) => {
      const items = row.original.items
      return items.map(item => item.product.modelName).join(", ")
    }
  },
  {
    id: "dates",
    header: "Dates",
    cell: ({ row }) => {
      const firstItem = row.original.items[0]
      if (!firstItem) return "-"
      const start = new Date(firstItem.startDate).toLocaleDateString('en-GB')
      const end = new Date(firstItem.endDate).toLocaleDateString('en-GB')
      return `${start} - ${end}`
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"))
      return <div className="font-medium">{formatCurrency(amount)}</div>
    },
  },
]
