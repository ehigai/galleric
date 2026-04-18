import UploadImages from "@/components/UploadImages";
import DeleteImageButton from "@/components/DeleteImageButton";
import { getImages } from "@/lib/db/image";
import { getGalleryBySlug } from "@/lib/db/gallery";
import { getUserPermissions } from "@/lib/permissions/getUserPermissions";
import Image from "next/image";
import Link from "next/link";
import GalleryImageLink from "@/components/GalleryImageLink";
import { verifySession } from "@/lib/dal";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [images, gallery] = await Promise.all([
    getImages(slug),
    getGalleryBySlug(slug),
  ]);

  // Determine if the current user can delete images in this gallery
  let userId: string | null = null;
  try {
    const session = await verifySession();
    userId = session.user.id;
  } catch {
    // Not logged in
  }

  const ability = getUserPermissions(userId ? { id: userId } : null);
  const isGalleryOwner = gallery?.ownerId === userId;

  return (
    <div className="mx-auto max-w-[1960px] p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Gallery
          </p>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {slug.replace(/-/g, " ")}
          </h1>
        </div>
        <Link
          href={`/dashboard/gallery/${slug}/settings`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Settings
        </Link>
      </div>

      {/* Image bento grid */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm">This gallery is empty. Upload some images below.</p>
        </div>
      ) : (
        <div
          className="grid gap-4 w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gridAutoRows: "220px",
          }}
        >
          {images.map((image, i) => {
            // User can delete if they're the gallery owner or the image uploader
            const canDeleteThisImage =
              isGalleryOwner || image.uploaderId === userId;

            return (
              <GalleryImageLink
                key={image.id}
                href={`/@${slug}/p/${image.id}`}
                className={`group relative overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-xl transition-shadow duration-300 ${
                  i % 7 === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <Image
                  src={image.url}
                  alt={`Image ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholder={image.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={image.blurDataUrl ?? undefined}
                />
                {image.isCover && (
                  <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-white/10 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">
                    Cover
                  </span>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Delete button — only for authorized users */}
                {canDeleteThisImage && (
                  <DeleteImageButton imageId={image.id} />
                )}
              </GalleryImageLink>
            );
          })}
        </div>
      )}

      {/* Upload section */}
      <div className="mt-8">
        <UploadImages gallerySlug={slug} />
      </div>
    </div>
  );
}
