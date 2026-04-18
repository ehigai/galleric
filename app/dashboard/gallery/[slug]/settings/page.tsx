import SettingsForm from "@/components/forms/SettingsForm";
import CoverImageSelector from "@/components/CoverImageSelector";
import DangerZone from "@/components/DangerZone";
import { getGalleryBySlug } from "@/lib/db/gallery";
import { getImages } from "@/lib/db/image";
import Link from "next/link";
import { ImageProps } from "@/types/type";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [gallery, images] = await Promise.all([
    getGalleryBySlug(slug),
    getImages(slug),
  ]);

  if (!gallery) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <p className="text-muted-foreground">Gallery not found.</p>
      </div>
    );
  }

  const currentCover = images.find((img) => img.isCover);

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/dashboard/gallery/${slug}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to gallery
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{slug.replace(/-/g, " ")}</p>
        </div>
      </div>

      <hr className="border-border" />

      {/* Cover Image */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Cover Image</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            This image appears as the gallery thumbnail on the home page.
          </p>
        </div>
        <CoverImageSelector
          gallerySlug={slug}
          images={images as ImageProps[]}
          currentCoverId={currentCover?.id}
        />
      </section>

      <hr className="border-border" />

      {/* Visibility & Permissions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Visibility &amp; Permissions</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Control who can see and contribute to your gallery.
          </p>
        </div>
        <SettingsForm gallery={gallery} />
      </section>

      <hr className="border-border" />

      <DangerZone gallerySlug={slug} />
    </div>
  );
}
