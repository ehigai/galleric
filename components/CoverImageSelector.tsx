"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { setCoverImage } from "@/actions/image-actions";
import { ImageProps } from "@/types/type";

type Tab = "gallery" | "upload";

export default function CoverImageSelector({
  gallerySlug,
  images,
  currentCoverId,
}: {
  gallerySlug: string;
  images: ImageProps[];
  currentCoverId?: string;
}) {
  const [tab, setTab] = useState<Tab>("gallery");
  const [selectedId, setSelectedId] = useState<string | undefined>(currentCoverId);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  function handleSelect(id: string) {
    if (id === selectedId) return;
    setSelectedId(id);
    setFeedback(null);
    startTransition(async () => {
      const res = await setCoverImage(id, gallerySlug);
      if (res.success) {
        setFeedback({ ok: true, msg: "Cover image updated!" });
      } else {
        setSelectedId(currentCoverId);
        setFeedback({ ok: false, msg: (res as any).error ?? "Failed to set cover." });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {(["gallery", "upload"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "gallery" ? "From Gallery" : "Upload New"}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <p
          className={`text-xs font-medium px-3 py-2 rounded-lg border ${
            feedback.ok
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {feedback.msg}
        </p>
      )}

      {tab === "gallery" ? (
        images.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images in this gallery yet.</p>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}
          >
            {images.map((img) => {
              const isSelected = img.id === selectedId;
              return (
                <button
                  key={img.id}
                  onClick={() => handleSelect(img.id)}
                  disabled={isPending}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/30 scale-[0.97]"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt="Gallery image"
                    fill
                    sizes="120px"
                    className="object-cover"
                    placeholder={img.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={img.blurDataUrl ?? undefined}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )
      ) : (
        <UploadNewCover gallerySlug={gallerySlug} onUploaded={handleSelect} />
      )}

      {isPending && (
        <p className="text-xs text-muted-foreground animate-pulse">Saving…</p>
      )}
    </div>
  );
}

// ── Upload new cover tab ──────────────────────────────────────────────────────
import { uploadAndSaveImages } from "@/actions/image-actions";

function UploadNewCover({
  gallerySlug,
  onUploaded,
}: {
  gallerySlug: string;
  onUploaded: (newId: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  }

  async function handleUpload() {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append("images", file);

    startTransition(async () => {
      const res = await uploadAndSaveImages(formData, gallerySlug);
      if (res.success && res.data?.[0]) {
        const newId = res.data[0].id;
        await setCoverImage(newId, gallerySlug);
        onUploaded(newId);
        setPreview(null);
        setFile(null);
      } else {
        setError((res as any).error ?? "Upload failed.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center gap-3 w-full h-40 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-ring transition-colors bg-muted/30 relative overflow-hidden">
        {preview ? (
          <Image src={preview} alt="Preview" fill className="object-cover rounded-2xl opacity-70" />
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-sm text-muted-foreground">Click to choose an image</span>
          </>
        )}
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      </label>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || isPending}
        className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {isPending ? "Uploading…" : "Upload & Set as Cover"}
      </button>
    </div>
  );
}
