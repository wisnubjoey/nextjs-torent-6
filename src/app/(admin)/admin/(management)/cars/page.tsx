'use client';

import { useState, useEffect } from 'react';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X, Image as ImageIcon } from 'lucide-react';

type Image = {
  id: string;
  url: string;
  name: string;
  key: string;
};

export default function CarsPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast.success('Image removed from gallery');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleClearAll = async () => {
    try {
      const deletePromises = images.map((img) =>
        fetch(`/api/images/${img.id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      setImages([]);
      toast.success('All images removed');
    } catch (error) {
      console.error('Error clearing images:', error);
      toast.error('Failed to clear images');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Car Image Gallery</h1>
          <p className="text-muted-foreground">Upload and manage car images</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Upload Images</h2>
            <p className="text-sm text-muted-foreground">
              Max file size: 4MB per image
            </p>
          </div>

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={async (res) => {
              if (res && res.length > 0) {
                try {
                  const savePromises = res.map((file) =>
                    fetch('/api/images', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        url: file.url,
                        name: file.name,
                        key: file.key,
                      }),
                    })
                  );

                  const responses = await Promise.all(savePromises);
                  const savedImages = await Promise.all(
                    responses.map((res) => res.json())
                  );

                  setImages((prev) => [...prev, ...savedImages]);
                  toast.success(`Successfully uploaded ${savedImages.length} image(s)`);
                } catch (error) {
                  console.error('Error saving images:', error);
                  toast.error('Failed to save images to database');
                }
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
              button: 'ut-uploading:cursor-not-allowed',
              container: 'w-max flex flex-col items-center gap-4',
              allowedContent: 'hidden',
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Loading images...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Gallery ({images.length} images)
            </h3>
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-full items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(image.id)}
                      className="size-10"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs text-white">{image.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <ImageIcon className="size-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No images uploaded yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload your first car image using the button above
          </p>
        </div>
      )}
    </div>
  );
}
