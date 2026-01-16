"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Car, Filter, Loader2, Info, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/stores/cart-store"
import { toast } from "sonner"
import { addDays } from "date-fns"
import { CartItem } from "@/types/cart"

interface Price {
  pricingTypeId: string
  price: number
  name: string
}

interface Vehicle {
  id: string
  modelName: string
  image: string | null
  brandId: string | null
  brandName: string | null
  prices: Price[]
}

interface Brand {
  id: string
  name: string
  logo: string | null
}

export default function BrowseVehiclesPage() {
  const { addItem, items } = useCart()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")

  const handleAddToCart = (vehicle: Vehicle, price: Price) => {
    const startDate = new Date()
    const endDate = addDays(startDate, 1)
    
    addItem({
      id: `${vehicle.id}-${price.pricingTypeId}-${startDate.getTime()}`,
      product: {
        id: vehicle.id,
        modelName: vehicle.modelName,
        image: vehicle.image,
      } as CartItem['product'],
      pricingTypeId: price.pricingTypeId,
      pricingTypeName: price.name,
      price: price.price,
      quantity: 1,
      startDate: startDate,
      endDate: endDate,
      days: 1,
    })
    
    toast.success(`${vehicle.modelName} added to cart!`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, brandsRes] = await Promise.all([
          fetch("/api/cars"),
          fetch("/api/brands")
        ])
        
        if (!carsRes.ok || !brandsRes.ok) {
           throw new Error("Failed to fetch data")
        }

        const carsData = await carsRes.json()
        const brandsData = await brandsRes.json()
        
        setVehicles(Array.isArray(carsData) ? carsData : [])
        setBrands(Array.isArray(brandsData) ? brandsData : [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (vehicle.brandName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    const matchesBrand = selectedBrand === "all" || vehicle.brandId === selectedBrand
    return matchesSearch && matchesBrand
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading vehicles...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex justify-between items-center w-full md:w-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browse Vehicles</h1>
            <p className="text-muted-foreground">Find the perfect car for your next journey.</p>
          </div>
          <Link href="/dashboard/cart" className="md:hidden">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/dashboard/cart" className="hidden md:block">
            <Button variant="outline" className="relative gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by model or brand..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-lg p-12 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No vehicles found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">
            We couldt find any vehicles matching your current filters. Try adjusting your search or brand filter.
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => {
              setSearchQuery("")
              setSelectedBrand("all")
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group overflow-hidden flex flex-col hover:shadow-lg transition-shadow border-muted-foreground/20">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {vehicle.image ? (
                  <Image
                    src={vehicle.image}
                    alt={vehicle.modelName}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-background/80 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded border border-muted-foreground/20 uppercase tracking-wider shadow-sm">
                    {vehicle.brandName || "Unknown"}
                  </span>
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-xl line-clamp-1">{vehicle.modelName}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="space-y-2 mt-2">
                  {vehicle.prices.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {vehicle.prices.map((price) => (
                        <div key={price.pricingTypeId} className="flex flex-col bg-muted/50 rounded-md p-2 min-w-[80px]">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{price.name}</span>
                          <span className="text-lg font-bold">
                            ${price.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                      <Info className="h-4 w-4" />
                      <span>Contact for pricing</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full font-semibold group-hover:bg-primary/90 transition-colors"
                  onClick={() => vehicle.prices.length > 0 && handleAddToCart(vehicle, vehicle.prices[0])}
                  disabled={vehicle.prices.length === 0}
                >
                  {vehicle.prices.length > 0 ? "Add to Cart" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
