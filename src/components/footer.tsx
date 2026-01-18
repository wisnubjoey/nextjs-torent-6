import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12 text-sm">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-4">
            <Car className="h-5 w-5" />
            RentWheels
          </div>
          <p className="text-muted-foreground">
            Providing top-quality car rental services for travelers and locals
            alike. Your journey starts here.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-primary">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Contact Support
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <p className="text-muted-foreground mb-4">
            Subscribe to get the latest offers and updates.
          </p>
          <div className="flex gap-2">
            <Input placeholder="Email address" className="bg-background" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} RentWheels. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
