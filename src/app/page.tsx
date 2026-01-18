import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Calendar,
  Shield,
  Zap,
  Star,
  Users,
  Fuel,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  const popularCars = [
    {
      id: 1,
      name: "Toyota Avanza",
      type: "MPV",
      image: "/gambar.png",
      price: 45,
      passengers: 7,
      transmission: "Automatic",
      fuel: "Petrol",
    },
    {
      id: 2,
      name: "Honda Civic",
      type: "Sedan",
      image: "/gambar.png",
      price: 85,
      passengers: 5,
      transmission: "Automatic",
      fuel: "Petrol",
    },
    {
      id: 3,
      name: "Mitsubishi Pajero",
      type: "SUV",
      image: "/gambar.png",
      price: 120,
      passengers: 7,
      transmission: "Automatic",
      fuel: "Diesel",
    },
    {
      id: 4,
      name: "Suzuki Jimny",
      type: "Mini SUV",
      image: "/gambar.png",
      price: 65,
      passengers: 4,
      transmission: "Manual",
      fuel: "Petrol",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-muted/30 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Find Your <span className="text-primary">Best Drive</span> For The
                Weekend
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the ultimate freedom of choice with our premium car
                rental service. Affordable rates, luxury options, and instant
                booking.
              </p>

              {/* Search Form */}
              
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent hidden lg:block" />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the best experience for our customers with transparent
                pricing and reliable vehicles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/50">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Secure & Safe</h3>
                <p className="text-muted-foreground">
                  All our vehicles are insured and regularly inspected for your
                  safety and peace of mind.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/50">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Fast Booking</h3>
                <p className="text-muted-foreground">
                  Book your car in minutes with our easy-to-use online platform
                  and instant confirmation.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/50">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Best Prices</h3>
                <p className="text-muted-foreground">
                  We guarantee the competitive rates in the market with no hidden
                  fees or extra charges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Cars */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Popular Cars</h2>
                <p className="text-muted-foreground">
                  Choose from our most rented vehicles
                </p>
              </div>
              <Button variant="outline">View All Fleet</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCars.map((car) => (
                <Card
                  key={car.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full bg-muted">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{car.name}</CardTitle>
                        <CardDescription>{car.type}</CardDescription>
                      </div>
                      <div className="font-bold text-primary">
                        {formatCurrency(car.price)}
                        <span className="text-xs font-normal text-muted-foreground">
                          /day
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {car.passengers}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {car.transmission}
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-4 w-4" />
                        {car.fuel}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Rent Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Don&apos;t wait any longer. Book your perfect car today and explore
              the world with comfort and style.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Book a Car
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
