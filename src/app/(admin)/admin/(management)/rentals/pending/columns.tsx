"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/db/schema"

import { Button } from "@/components/ui/button"
import { acceptOrder } from "./actions"
import { toast } from "sonner"
import { Check } from "lucide-react"

export type PendingRental = {
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

export const columns: ColumnDef<PendingRental>[] = [
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
      return (
        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 capitalize">
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
  {
    id: "actions",
    header: "Accept",
    cell: ({ row }) => {
      return (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={async () => {
            const result = await acceptOrder(row.original.id)
            if (result.success) {
              toast.success("Order accepted successfully")
            } else {
              toast.error("Failed to accept order")
            }
          }}
        >
          <Check className="w-4 h-4 mr-2" />
          Accept
        </Button>
      )
    },
  },
]
