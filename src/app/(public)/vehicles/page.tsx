import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Users, Zap, Briefcase } from "lucide-react";

export default function VehiclesPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4 text-primary bg-primary/10 hover:bg-primary/20">
            Pilihan Armada
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Kendaraan Terbaik Untuk <br className="hidden md:block" /> Perjalanan Anda
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Temukan mobil yang sesuai dengan kebutuhan dan budget Anda. Unit kami terjamin bersih, terawat, dan nyaman.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button variant="default">Semua Mobil</Button>
          <Button variant="outline">MPV</Button>
          <Button variant="outline">SUV</Button>
          <Button variant="outline">City Car</Button>
          <Button variant="outline">Luxury</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {/* Card 1: Avanza */}
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-muted">
                <div className="relative h-56 bg-muted">
                    <div className="absolute top-4 left-4 z-10">
                         <Badge className="bg-orange-500 hover:bg-orange-600">Paling Laris</Badge>
                    </div>
                    <Image src="https://picsum.photos/seed/avanza/800/600" alt="Toyota Avanza" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-5">
                    <div className="mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">MPV Keluarga</span>
                    </div>
                    <CardTitle className="mb-4 group-hover:text-primary transition-colors">Toyota Avanza</CardTitle>
                    
                    <div className="flex items-center justify-between py-4 border-t border-b border-border mb-4">
                         <div className="flex flex-col items-center gap-1.5">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">7 Kursi</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                             <Zap className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">Manual</span>
                        </div>
                         <div className="flex flex-col items-center gap-1.5">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">2 Tas</span>
                        </div>
                    </div>
                    
                     <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-[11px] text-muted-foreground font-medium">Harga Mulai</p>
                          <p className="text-lg font-bold">Rp 350rb<span className="text-sm font-normal text-muted-foreground">/hari</span></p>
                        </div>
                        <Button className="w-full">Sewa</Button>
                      </div>
                </CardContent>
            </Card>

             {/* Card 2: Brio */}
             <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-muted">
                <div className="relative h-56 bg-muted">
                    <Image src="https://picsum.photos/seed/brio/800/600" alt="Honda Brio" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-5">
                    <div className="mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">City Car</span>
                    </div>
                    <CardTitle className="mb-4 group-hover:text-primary transition-colors">Honda Brio</CardTitle>
                    
                    <div className="flex items-center justify-between py-4 border-t border-b border-border mb-4">
                         <div className="flex flex-col items-center gap-1.5">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">5 Kursi</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                             <Zap className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">Matic</span>
                        </div>
                         <div className="flex flex-col items-center gap-1.5">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">2 Tas</span>
                        </div>
                    </div>
                    
                     <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-[11px] text-muted-foreground font-medium">Harga Mulai</p>
                          <p className="text-lg font-bold">Rp 300rb<span className="text-sm font-normal text-muted-foreground">/hari</span></p>
                        </div>
                        <Button className="w-full">Sewa</Button>
                      </div>
                </CardContent>
            </Card>

            {/* Card 3: Innova */}
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-muted">
                <div className="relative h-56 bg-muted">
                    <Image src="https://picsum.photos/seed/innova/800/600" alt="Toyota Innova" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-5">
                    <div className="mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">MPV Premium</span>
                    </div>
                    <CardTitle className="mb-4 group-hover:text-primary transition-colors">Innova Reborn</CardTitle>
                    
                    <div className="flex items-center justify-between py-4 border-t border-b border-border mb-4">
                         <div className="flex flex-col items-center gap-1.5">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">7 Kursi</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                             <Zap className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">Matic</span>
                        </div>
                         <div className="flex flex-col items-center gap-1.5">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">4 Tas</span>
                        </div>
                    </div>
                    
                     <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-[11px] text-muted-foreground font-medium">Harga Mulai</p>
                          <p className="text-lg font-bold">Rp 600rb<span className="text-sm font-normal text-muted-foreground">/hari</span></p>
                        </div>
                        <Button className="w-full">Sewa</Button>
                      </div>
                </CardContent>
            </Card>

            {/* Card 4: Alphard */}
             <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-muted">
                <div className="relative h-56 bg-muted">
                    <div className="absolute top-4 left-4 z-10">
                         <Badge variant="default">Limited</Badge>
                    </div>
                    <Image src="https://picsum.photos/seed/alphard/800/600" alt="Toyota Alphard" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-5">
                    <div className="mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Luxury Van</span>
                    </div>
                    <CardTitle className="mb-4 group-hover:text-primary transition-colors">Toyota Alphard</CardTitle>
                    
                    <div className="flex items-center justify-between py-4 border-t border-b border-border mb-4">
                         <div className="flex flex-col items-center gap-1.5">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">7 Kursi</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                             <Zap className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">Matic</span>
                        </div>
                         <div className="flex flex-col items-center gap-1.5">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground">6 Tas</span>
                        </div>
                    </div>
                    
                     <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-[11px] text-muted-foreground font-medium">Harga Mulai</p>
                          <p className="text-lg font-bold">Rp 2.5jt<span className="text-sm font-normal text-muted-foreground">/hari</span></p>
                        </div>
                        <Button className="w-full">Sewa</Button>
                      </div>
                </CardContent>
            </Card>

        </div>
        
        <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="rounded-full">
                Lihat Semua Armada
            </Button>
        </div>

      </div>
    </section>
  );
}
