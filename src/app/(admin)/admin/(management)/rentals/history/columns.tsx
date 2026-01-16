"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/db/schema"

export type HistoryRental = {
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

export const columns: ColumnDef<HistoryRental>[] = [
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
      const start = new Date(firstItem.startDate).toLocaleDateString()
      const end = new Date(firstItem.endDate).toLocaleDateString()
      return `${start} - ${end}`
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus
      const variant = status === OrderStatus.Completed ? 'default' : 'destructive'
      const className = status === OrderStatus.Completed ? 'bg-blue-600 hover:bg-blue-700' : ''
      
      return (
        <Badge variant={variant} className={`capitalize ${className}`}>
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
]
