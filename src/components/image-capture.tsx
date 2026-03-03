"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageCaptureProps {
  onImageCaptured: (base64: string) => void;
  disabled?: boolean;
}

export function ImageCapture({ onImageCaptured, disabled }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      // Extract base64 data (remove data URL prefix)
      const base64 = result.split(",")[1];
      onImageCaptured(base64);
    };
    reader.readAsDataURL(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Captured dish"
            className="w-full max-h-80 object-cover"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              setPreview(null);
              if (cameraRef.current) cameraRef.current.value = "";
              if (galleryRef.current) galleryRef.current.value = "";
            }}
          >
            ✕ Clear
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
          <p className="text-muted-foreground">
            Take a photo or upload an image of a dish
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => cameraRef.current?.click()}
              disabled={disabled}
            >
              📷 Take Photo
            </Button>
            <Button
              variant="outline"
              onClick={() => galleryRef.current?.click()}
              disabled={disabled}
            >
              🖼️ Upload
            </Button>
          </div>
        </div>
      )}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
