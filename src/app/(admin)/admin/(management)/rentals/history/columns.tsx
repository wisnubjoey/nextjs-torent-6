"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/db/schema"
import { formatCurrency } from "@/lib/utils"

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
      // Use consistent formatting to prevent hydration mismatch
      const start = new Date(firstItem.startDate).toLocaleDateString('en-GB') // dd/mm/yyyy
      const end = new Date(firstItem.endDate).toLocaleDateString('en-GB')   // dd/mm/yyyy
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
      return <div className="font-medium">{formatCurrency(amount)}</div>
    },
  },
]
