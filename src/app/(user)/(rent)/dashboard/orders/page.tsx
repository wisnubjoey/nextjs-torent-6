"use client"

import { useEffect, useState } from "react"
import { format, isBefore } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, History } from "lucide-react"
import { OrderStatus } from "@/db/schema"

interface OrderItem {
  id: string
  product: {
    modelName: string
    image: string | null
  }
  pricingType: {
    name: string
  }
  quantity: number
  priceSnapshot: number
  startDate: string
  endDate: string
}

interface Order {
  id: string
  status: OrderStatus
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders")
        if (res.ok) {
          const data = await res.json()
          
          // Filter logic for "Order History":
          // 1. Cancelled or Completed orders
          // 2. Confirmed orders where ALL items' endDate is in the past
          const now = new Date()
          const historyOrders = data.orders.filter((order: Order) => {
            if (order.status === OrderStatus.Cancelled || order.status === OrderStatus.Completed) return true
            if (order.status === OrderStatus.Active) {
              return order.items.every(item => isBefore(new Date(item.endDate), now))
            }
            return false
          })
          
          setOrders(historyOrders)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-lg p-12 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No past orders found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Your completed or cancelled rentals will appear here.
            </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Order History</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/40 flex flex-row items-center justify-between py-4">
              <div className="space-y-1">
                <CardTitle className="text-base font-medium">
                  Order #{order.id.slice(0, 8)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">
                  {formatCurrency(order.totalAmount)}
                </span>
                <Badge 
                  variant={
                    order.status === OrderStatus.Completed || order.status === OrderStatus.Cancelled ? "default" : 
                    order.status === OrderStatus.Active ? "destructive" : "secondary"
                  }
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Rental Period</TableHead>
                    <TableHead>Rate Type</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product.modelName}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(item.startDate), "MMM dd")} - {format(new Date(item.endDate), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {item.pricingType.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.priceSnapshot)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
