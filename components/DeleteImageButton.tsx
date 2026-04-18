"use client";

import { useState, useTransition } from "react";
import { deleteImage } from "@/actions/image-actions";

export default function DeleteImageButton({ imageId }: { imageId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteImage(imageId);
      setConfirmOpen(false);
    });
  }

  if (confirmOpen) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm rounded-2xl p-3">
        <p className="text-white text-xs font-medium text-center">Delete this image?</p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1.5 bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={() => setConfirmOpen(false)}
            disabled={isPending}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setConfirmOpen(true);
      }}
      className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-destructive text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
      aria-label="Delete image"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    </button>
  );
}
