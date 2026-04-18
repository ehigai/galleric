import { getUserGalleries } from "@/lib/db/gallery";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const userGalleries = await getUserGalleries();

  if (!userGalleries || userGalleries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
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
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p className="text-sm">No galleries yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1960px] space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Your Galleries</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {userGalleries.length} {userGalleries.length === 1 ? "gallery" : "galleries"}
        </p>
      </div>

      <div
        className="grid gap-4 w-full"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gridAutoRows: "220px",
        }}
      >
        {userGalleries.map((gallery) => {
          const coverImage = gallery.images.find((img) => img.isCover) ?? gallery.images[0];
          return (
            <Link
              key={gallery.id}
              href={`/dashboard/gallery/${gallery.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {coverImage ? (
                <Image
                  src={coverImage.url}
                  alt={gallery.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholder={coverImage.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={coverImage.blurDataUrl ?? undefined}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs">No images yet</span>
                </div>
              )}

              {/* Gradient overlay + info on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white font-semibold text-sm leading-tight">{gallery.name}</p>
                <p className="text-white/60 text-xs mt-0.5">{gallery.images.length} image{gallery.images.length !== 1 ? "s" : ""}</p>
              </div>

              {/* Name chip for empty galleries */}
              {!coverImage && (
                <div className="absolute top-3 left-3 right-3">
                  <p className="text-foreground text-sm font-semibold truncate">{gallery.name}</p>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
