"use client"

import { useCart } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, addDays, addWeeks, addMonths, differenceInDays } from "date-fns"
import { Trash2, ShoppingCart, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CartItem } from "@/types/cart"

export default function CartPage() {
  const { items, removeItem, updateItem, clearCart, total } = useCart()
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

  const calculateEndDate = (start: Date, qty: number, typeName: string) => {
    if (typeName.toLowerCase().includes('daily')) {
      return addDays(start, qty)
    } else if (typeName.toLowerCase().includes('weekly')) {
      return addWeeks(start, qty)
    } else if (typeName.toLowerCase().includes('monthly')) {
      return addMonths(start, qty)
    }
    return addDays(start, qty) // Default
  }

  const handlePricingTypeChange = (item: CartItem, newPricingTypeId: string) => {
    const newPrice = item.availablePrices?.find(p => p.pricingTypeId === newPricingTypeId)
    if (!newPrice) return

    const newEndDate = calculateEndDate(new Date(item.startDate), item.quantity, newPrice.name)
    const newDays = differenceInDays(newEndDate, new Date(item.startDate))

    updateItem(item.id, {
      pricingTypeId: newPricingTypeId,
      pricingTypeName: newPrice.name,
      price: newPrice.price,
      endDate: newEndDate,
      days: newDays
    })
  }

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return

    const newEndDate = calculateEndDate(new Date(item.startDate), newQuantity, item.pricingTypeName)
    const newDays = differenceInDays(newEndDate, new Date(item.startDate))

    updateItem(item.id, {
      quantity: newQuantity,
      endDate: newEndDate,
      days: newDays
    })
  }

  const handleStartDateChange = (item: CartItem, newDateString: string) => {
    const newStartDate = new Date(newDateString)
    if (isNaN(newStartDate.getTime())) return

    const newEndDate = calculateEndDate(newStartDate, item.quantity, item.pricingTypeName)
    const newDays = differenceInDays(newEndDate, newStartDate)

    updateItem(item.id, {
      startDate: newStartDate,
      endDate: newEndDate,
      days: newDays
    })
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
                
                <CardContent className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{item.product.modelName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.days} Days Duration ({format(new Date(item.startDate), "MMM dd")} - {format(new Date(item.endDate), "MMM dd")})
                      </p>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Pricing Type Selector */}
                    <div className="space-y-2">
                      <Label htmlFor={`pricing-${item.id}`}>Pricing Model</Label>
                      <select
                        id={`pricing-${item.id}`}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={item.pricingTypeId}
                        onChange={(e) => handlePricingTypeChange(item, e.target.value)}
                      >
                        {item.availablePrices?.map((price) => (
                          <option key={price.pricingTypeId} value={price.pricingTypeId}>
                            {price.name} ({formatCurrency(price.price)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Start Date Picker */}
                    <div className="space-y-2">
                      <Label htmlFor={`date-${item.id}`}>Start Date</Label>
                      <Input
                        id={`date-${item.id}`}
                        type="date"
                        value={format(new Date(item.startDate), 'yyyy-MM-dd')}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        onChange={(e) => handleStartDateChange(item, e.target.value)}
                      />
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-2">
                      <Label htmlFor={`qty-${item.id}`}>Quantity ({item.pricingTypeName})</Label>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t mt-2">
                    <div className="text-sm text-muted-foreground">
                      Unit Price: {formatCurrency(item.price)} / {item.pricingTypeName}
                    </div>
                    <div className="text-lg font-bold">
                      {formatCurrency(item.price * item.quantity)}
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
                <span className="font-medium">{formatCurrency(total())}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total())}</span>
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
