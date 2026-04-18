"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clearGallery, deleteGallery } from "@/actions/image-actions";

export default function DangerZone({ gallerySlug }: { gallerySlug: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<"clear" | "delete" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClear() {
    setError(null);
    startTransition(async () => {
      const res = await clearGallery(gallerySlug);
      if (res.success) {
        setConfirm(null);
      } else {
        setError((res as any).error ?? "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteGallery(gallerySlug);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError((res as any).error ?? "Something went wrong.");
      }
    });
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          These actions are irreversible. Proceed with caution.
        </p>
      </div>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 divide-y divide-destructive/10 overflow-hidden">
        {/* Clear gallery */}
        <div className="flex items-center justify-between p-4 gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">Clear Gallery</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete all images in this gallery.
            </p>
          </div>
          {confirm === "clear" ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">Are you sure?</span>
              <button
                onClick={handleClear}
                disabled={isPending}
                className="px-3 py-1.5 bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? "Clearing…" : "Yes, clear"}
              </button>
              <button
                onClick={() => setConfirm(null)}
                disabled={isPending}
                className="px-3 py-1.5 bg-secondary hover:bg-muted text-secondary-foreground text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirm("clear")}
              className="shrink-0 px-4 py-2 text-xs font-semibold text-destructive border border-destructive/30 rounded-xl hover:bg-destructive/10 transition-colors"
            >
              Clear Gallery
            </button>
          )}
        </div>

        {/* Delete gallery */}
        <div className="flex items-center justify-between p-4 gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">Delete Gallery</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete this gallery and all its images. This cannot be undone.
            </p>
          </div>
          {confirm === "delete" ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">Are you sure?</span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-3 py-1.5 bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setConfirm(null)}
                disabled={isPending}
                className="px-3 py-1.5 bg-secondary hover:bg-muted text-secondary-foreground text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirm("delete")}
              className="shrink-0 px-4 py-2 text-xs font-semibold text-destructive border border-destructive/30 rounded-xl hover:bg-destructive/10 transition-colors"
            >
              Delete Gallery
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
