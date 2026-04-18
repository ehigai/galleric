"use client";

import { createGallery, CreateGalleryState } from "@/actions/gallery-actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createPortal } from "react-dom";

interface CreateGalleryFormModalProps {
  setGalleryCreateModal: (value: boolean) => void;
}

export default function CreateGalleryFormModal({
  setGalleryCreateModal,
}: CreateGalleryFormModalProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    CreateGalleryState,
    FormData
  >(createGallery, null);

  useEffect(() => {
    if (state && "slug" in state) {
      setGalleryCreateModal(false);
      router.push(`/dashboard/gallery/${state.slug}`);
    }
  }, [state, router, setGalleryCreateModal]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGalleryCreateModal(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setGalleryCreateModal]);

  const errors = state && "errors" in state ? state.errors : null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setGalleryCreateModal(false);
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6 text-card-foreground shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Create Gallery</h2>
          <button
            onClick={() => setGalleryCreateModal(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gallery Name
            </label>
            <div
              className={`flex items-center w-full rounded-xl border bg-input transition-all focus-within:ring-2 focus-within:ring-ring overflow-hidden ${
                errors?.name ? "border-destructive" : "border-border"
              }`}
            >
              <input
                type="text"
                placeholder="My Awesome Gallery"
                name="name"
                autoFocus
                className="flex-1 min-w-0 bg-transparent py-3 px-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
            </div>
            {errors?.name && (
              <p className="text-destructive text-xs">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gallery URL
            </label>
            <div
              className={`flex items-center w-full rounded-xl border bg-input transition-all focus-within:ring-2 focus-within:ring-ring overflow-hidden ${
                errors?.slug ? "border-destructive" : "border-border"
              }`}
            >
              <span className="pl-4 pr-0.5 text-muted-foreground text-sm select-none pointer-events-none whitespace-nowrap">
                @
              </span>
              <input
                type="text"
                placeholder="my-gallery"
                name="slug"
                className="flex-1 min-w-0 bg-transparent py-3 pr-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
            </div>
            {errors?.slug && (
              <p className="text-destructive text-xs">{errors.slug}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <>
                Create Gallery
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}
