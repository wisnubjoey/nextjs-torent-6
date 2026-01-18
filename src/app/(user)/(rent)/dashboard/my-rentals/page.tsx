"use client"

import { useEffect, useState } from "react"
import { format, isAfter } from "date-fns"
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
import { Loader2, Key, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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

export default function MyRentalsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders")
        if (res.ok) {
          const data = await res.json()
          
          // Filter logic for "My Rentals":
          // 1. Pending orders
          // 2. Confirmed orders
          // 3. Active orders where at least one item's endDate is in the future
          const now = new Date()
          const activeOrders = data.orders.filter((order: Order) => {
            if (order.status === OrderStatus.Pending) return true
            if (order.status === OrderStatus.Confirmed) return true
            if (order.status === OrderStatus.Active) {
              return order.items.some(item => isAfter(new Date(item.endDate), now))
            }
            return false
          })
          
          setOrders(activeOrders)
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
        <h1 className="text-3xl font-bold mb-8">My Rentals</h1>
        <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-lg p-12 text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Key className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No active rentals</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
                You don&apos;t have any active or upcoming rentals at the moment.
            </p>
            <Link href="/dashboard/browse-vehicles">
                <Button>Browse Vehicles</Button>
            </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Rentals</h1>
        <p className="text-muted-foreground">Manage your current and upcoming vehicle rentals.</p>
      </div>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 flex flex-row items-center justify-between py-4 border-b">
              <div className="space-y-1">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Order #{order.id.slice(0, 8)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Booked on {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge 
                  variant={
                    order.status === OrderStatus.Active ? "default" : 
                    order.status === OrderStatus.Confirmed ? "secondary" : 
                    "outline"
                  }
                  className={`capitalize ${
                    order.status === OrderStatus.Confirmed ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""
                  }`}
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => {
                    const isUpcoming = isAfter(new Date(item.startDate), new Date())
                    const isActive = !isUpcoming && isAfter(new Date(item.endDate), new Date())
                    
                    return (
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
                          {order.status === OrderStatus.Pending ? (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200">Pending</Badge>
                          ) : order.status === OrderStatus.Confirmed ? (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200">Confirmed</Badge>
                          ) : isActive ? (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Currently Active</Badge>
                          ) : isUpcoming ? (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">Upcoming</Badge>
                          ) : (
                            <Badge variant="secondary">Recently Ended</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.priceSnapshot)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
