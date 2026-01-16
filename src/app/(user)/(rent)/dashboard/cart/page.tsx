"use client"

import { useCart } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Trash2, ShoppingCart, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            pricingTypeId: item.pricingTypeId,
            quantity: item.quantity,
            startDate: item.startDate,
            endDate: item.endDate,
          })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create order")
      }

      toast.success("Order placed successfully!")
      clearCart()
      router.push(`/dashboard/orders`) // Redirect to orders page
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Your cart is empty. Add some vehicles from the dashboard to get started.
            </p>
        <Link href="/dashboard/browse-vehicles">
          <Button size="lg" className="mt-4">
            Browse Vehicles
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 aspect-video sm:aspect-square bg-muted">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.modelName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                
                <CardContent className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{item.product.modelName}</h3>
                      {/* You might want to fetch brand name if not stored in product directly, 
                          but for now we rely on what's available or stored in item.product */}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      <span>{item.pricingTypeName} Rate: ${item.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{item.days} {item.days === 1 ? 'Day' : 'Days'}</span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-center gap-2 bg-muted/30 p-2 rounded text-xs">
                      <span className="font-medium">
                        {format(new Date(item.startDate), "MMM dd, yyyy")}
                      </span>
                      <span>-</span>
                      <span className="font-medium">
                        {format(new Date(item.endDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">${total().toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${total().toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                    <>
                    Checking out...
                    </>
                ) : (
                    "Proceed to Checkout"
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={clearCart}
                disabled={isCheckingOut}
              >
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
