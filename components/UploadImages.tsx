"use client";

import { useState, useRef, useEffect } from "react";
import { uploadAndSaveImages } from "@/actions/image-actions";

type ImagePayload = {
  file: File;
  preview: string;
};

interface ImageUploaderProps {
  onUploadComplete?: () => void;
  gallerySlug: string;
}

export default function ImageUploader({
  onUploadComplete,
  gallerySlug,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImagePayload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => {
      const preview = URL.createObjectURL(file);
      objectUrlsRef.current.push(preview);
      return { file, preview };
    });

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updatedImages = [...prev];
      const removed = updatedImages.splice(indexToRemove, 1)[0];
      URL.revokeObjectURL(removed.preview);
      objectUrlsRef.current = objectUrlsRef.current.filter(
        (url) => url !== removed.preview,
      );
      return updatedImages;
    });
  };

  const handleUpload = async () => {
    if (images.length === 0) return;
    setIsUploading(true);

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img.file));

    try {
      const response = await uploadAndSaveImages(formData, gallerySlug);

      if (response.success) {
        if (onUploadComplete) onUploadComplete();
        setImages([]);
      } else {
        console.error("Upload failed:", response.error);
        alert(response.error || "Failed to upload some images. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-3xl mx-auto bg-card rounded-2xl border border-border">
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Controls */}
      <div className="flex gap-4 w-full justify-center">
        <button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-6 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
        >
          Select Images
        </button>

        <button
          onClick={handleUpload}
          disabled={images.length === 0 || isUploading}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            `Upload ${images.length > 0 ? images.length : ""} ${
              images.length === 1 ? "Image" : "Images"
            }`
          )}
        </button>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full mt-2">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm group bg-muted"
            >
              <img
                src={img.preview}
                alt={`Preview ${index}`}
                className={`object-cover w-full h-full transition-opacity duration-200 ${
                  isUploading ? "opacity-40 grayscale" : "opacity-100"
                }`}
              />

              {!isUploading && (
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-foreground/60 hover:bg-destructive text-background rounded-full w-7 h-7 flex items-center justify-center transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
