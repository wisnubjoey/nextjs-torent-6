import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactUsPage() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4 text-primary bg-primary/10 hover:bg-primary/20">
            Hubungi Kami
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Ada Pertanyaan? <br className="hidden md:block" /> Kami Siap Membantu
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Tim kami siap membantu Anda dengan segala pertanyaan mengenai layanan rental mobil kami. Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          <div className="lg:col-span-1 space-y-6">
            {/* Address */}
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                 <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Alamat Kantor</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Jl. Raya Utama No. 123<br />
                    Jakarta Selatan, DKI Jakarta<br />
                    Indonesia 12345
                  </p>
                </div>
              </CardContent>
            </Card>

             {/* Phone */}
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Telepon</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    +62 21 1234 5678<br />
                    +62 812 3456 7890 (WhatsApp)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                   <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    info@rentalmobil.com<br />
                    support@rentalmobil.com
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Jam Operasional</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Senin - Jumat: 08:00 - 20:00<br />
                    Sabtu - Minggu: 09:00 - 18:00
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
                <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-6">Kirim Pesan</h3>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input id="name" placeholder="Masukkan nama lengkap" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="email@contoh.com" />
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="phone">No. Telepon</Label>
                                <Input id="phone" type="tel" placeholder="+62 8xx xxxx xxxx" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subjek</Label>
                                <select
                                    id="subject"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Pilih subjek</option>
                                    <option value="booking">Pertanyaan Booking</option>
                                    <option value="vehicle">Info Kendaraan</option>
                                    <option value="pricing">Harga & Promo</option>
                                    <option value="support">Bantuan & Dukungan</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="message">Pesan</Label>
                            <textarea
                                id="message"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tulis pesan Anda di sini..."
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Kirim Pesan
                        </Button>
                    </form>
                </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
}