'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UploadButton } from '@/lib/uploadthing';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

type Pricing = {
  pricingTypeId: string;
  price: number;
  name: string;
};

type Car = {
  id: string;
  modelName: string;
  image: string | null;
  brandId: string | null;
  brandName: string | null;
  prices: Pricing[];
};

type Brand = {
  id: string;
  name: string;
};

type PricingType = {
  id: string;
  name: string;
};

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    modelName: string;
    image: string;
    brandId: string;
    prices: Record<string, string>; // pricingTypeId -> price value
  }>({
    modelName: '',
    image: '',
    brandId: '',
    prices: {},
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [carsRes, brandsRes, typesRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/brands'),
        fetch('/api/pricing-types'),
      ]);

      if (carsRes.ok) setCars(await carsRes.json());
      if (brandsRes.ok) setBrands(await brandsRes.json());
      if (typesRes.ok) setPricingTypes(await typesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load initial data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSheet = (car?: Car) => {
    if (car) {
      setEditingCar(car);
      const pricesMap: Record<string, string> = {};
      car.prices.forEach((p) => {
        pricesMap[p.pricingTypeId] = p.price.toString();
      });
      setFormData({
        modelName: car.modelName,
        image: car.image || '',
        brandId: car.brandId || '',
        prices: pricesMap,
      });
    } else {
      setEditingCar(null);
      setFormData({ modelName: '', image: '', brandId: '', prices: {} });
    }
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars((prev) => prev.filter((c) => c.id !== id));
        toast.success('Car deleted successfully');
      } else {
        toast.error('Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.modelName) {
      toast.error('Model name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars';
      const method = editingCar ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedCar = await response.json();
        if (editingCar) {
          setCars((prev) => prev.map((c) => (c.id === savedCar.id ? savedCar : c)));
          toast.success('Car updated successfully');
        } else {
          setCars((prev) => [savedCar, ...prev]);
          toast.success('Car created successfully');
        }
        setIsSheetOpen(false);
      } else {
        toast.error('Failed to save car');
      }
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error('Failed to save car');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cars Management</h1>
          <p className="text-muted-foreground">Manage your fleet of vehicles</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/brands">
            <Button variant="outline">Manage Brands</Button>
          </Link>
          <Button onClick={() => handleOpenSheet()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Car
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model Name</TableHead>
              <TableHead>Prices</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No cars found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    {car.image ? (
                      <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-muted">
                        <img
                          src={car.image}
                          alt={car.modelName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{car.brandName || '-'}</TableCell>
                  <TableCell className="font-medium">{car.modelName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {car.prices.map((p) => (
                        <span key={p.pricingTypeId}>
                          {p.name}: {formatCurrency(p.price)}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenSheet(car)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(car.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {/* Brand Selection */}
            <div className="space-y-2 px-4">
              <Label htmlFor="brand">Brand</Label>
              <select
                id="brand"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.brandId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, brandId: e.target.value }))
                }
              >
                <option value="">Select a Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 px-4">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                className="h-10 px-4"
                placeholder="e.g. Camry"
                value={formData.modelName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, modelName: e.target.value }))
                }
                required
              />
            </div>

            {/* Pricing Inputs */}
            <div className="space-y-4 rounded-md border p-4 bg-muted/20">
              <h3 className="font-semibold text-sm">Pricing</h3>
              <div className="grid gap-4">
                {pricingTypes.map((type) => (
                  <div key={type.id} className="grid gap-2">
                    <Label htmlFor={`price-${type.id}`} className="text-xs font-medium">
                      {type.name} Price
                    </Label>
                    <div className="relative">
                      
                      <Input
                        id={`price-${type.id}`}
                        type="number"
                        placeholder="0"
                        min="0"
                        step="1"
                        className="pl-10"
                        value={formData.prices[type.id] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            prices: { ...prev.prices, [type.id]: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 px-4">
              <Label>Car Image</Label>
              {formData.image ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4">
                  <UploadButton
                    endpoint="imageUploader"
                    appearance={{
                      button:
                        "ut-ready:bg-blue-600 ut-uploading:cursor-not-allowed rounded-md bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full transition-all duration-200 ease-in-out text-sm font-medium shadow-sm",
                      container: "w-full max-w-[200px] mx-auto",
                      allowedContent: "text-xs text-muted-foreground mt-1",
                    }}
                    content={{
                      button: ({ ready, isUploading, uploadProgress }) => {
                        if (isUploading)
                          return (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{uploadProgress}%</span>
                            </div>
                          );
                        return ready ? "Choose Image" : "Loading...";
                      },
                      allowedContent: "Max 32MB",
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setFormData((prev) => ({ ...prev, image: res[0].url }));
                        toast.success('Image uploaded');
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    Upload car image
                  </span>
                </div>
              )}
            </div>

            <SheetFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCar ? 'Save Changes' : 'Add a New Car +'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
