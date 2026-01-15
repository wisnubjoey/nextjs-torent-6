"use client";

import React from 'react'
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard! Upload your images here.</p>
        </div>
        
        <div className="w-full max-w-xl p-4 border-2 border-dashed rounded-xl bg-card">
           <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                toast.success("Upload completed successfully!");
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
            />
        </div>
      </div>
    </div>
  )
}
