"use client";

import { useActionState, useOptimistic } from "react";
import {
  CreateGalleryState,
  updateGallerySettings,
} from "@/actions/gallery-actions";
import { Gallery } from "@/prisma/generated/prisma/client";

type OptimisticSettings = {
  isPublic: boolean;
  allowContribute: boolean;
};

export default function SettingsForm({ gallery }: { gallery: Gallery }) {
  const [state, formAction, isPending] = useActionState<
    CreateGalleryState,
    FormData
  >(updateGallerySettings, null);

  const [optimisticSettings, addOptimisticUpdate] = useOptimistic<
    OptimisticSettings,
    Partial<OptimisticSettings>
  >(
    {
      isPublic: gallery.isPublic,
      allowContribute: gallery.allowContribute,
    },
    (currentState, optimisticValue) => ({
      ...currentState,
      ...optimisticValue,
    }),
  );

  return (
    <form
      action={(formData) => {
        addOptimisticUpdate({
          isPublic: formData.get("isPublic") === "on",
          allowContribute: formData.get("allowContribution") === "on",
        });
        formAction(formData);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="slug" value={gallery.slug} />

      {/* Saving indicator */}
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving…
        </div>
      )}

      {/* Toggle: Public */}
      <label className={`flex items-center justify-between p-4 rounded-2xl bg-card border border-border cursor-pointer transition-opacity ${isPending ? "opacity-60" : ""}`}>
        <div>
          <p className="text-sm font-medium">Public Gallery</p>
          <p className="text-xs text-muted-foreground mt-0.5">Anyone can discover and view this gallery.</p>
        </div>
        <div className="relative">
          <input
            type="checkbox"
            name="isPublic"
            defaultChecked={optimisticSettings.isPublic}
            key={optimisticSettings.isPublic ? "pub-true" : "pub-false"}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform peer-checked:translate-x-5" />
        </div>
      </label>

      {/* Status badge */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium border ${
          optimisticSettings.isPublic
            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
            : "bg-muted text-muted-foreground border-border"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${optimisticSettings.isPublic ? "bg-green-500" : "bg-muted-foreground"}`} />
          {optimisticSettings.isPublic ? "Live" : "Draft"}
        </span>
      </div>

      {/* Toggle: Contributions */}
      <label className={`flex items-center justify-between p-4 rounded-2xl bg-card border border-border cursor-pointer transition-opacity ${isPending ? "opacity-60" : ""}`}>
        <div>
          <p className="text-sm font-medium">Allow Contributions</p>
          <p className="text-xs text-muted-foreground mt-0.5">Others can upload images to this gallery.</p>
        </div>
        <div className="relative">
          <input
            type="checkbox"
            name="allowContribution"
            defaultChecked={optimisticSettings.allowContribute}
            key={optimisticSettings.allowContribute ? "ac-true" : "ac-false"}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform peer-checked:translate-x-5" />
        </div>
      </label>

      {state && "errors" in state && state.errors?.slug && (
        <p className="text-destructive text-xs mt-2">{state.errors.slug}</p>
      )}
    </form>
  );
}
