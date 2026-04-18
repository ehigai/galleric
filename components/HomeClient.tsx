"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLastViewedPhoto } from "@/utils/useLastViewedPhoto";
import { authClient } from "@/lib/auth-client";
import Bridge from "./Icons/Bridge";
import Logo from "./Icons/Logo";
import SignInFormModal from "./forms/SignInForm";
import Button from "./ui/Button";
import { Gallery } from "@/prisma/generated/prisma/client";
import { ImageProps } from "@/types/type";

export default function HomeClient({
  galleries,
  photoId,
}: {
  galleries: (Gallery & { images: ImageProps[] })[];
  photoId?: string;
}) {
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const { data: session, isPending } = authClient.useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  // getGalleries() already fetches only the cover image per gallery (images[0])
  const heroCoverImage = galleries.find((g) => g.images.length > 0)?.images[0];

  return (
    <>
      {showLoginModal && (
        <SignInFormModal setShowLoginModal={setShowLoginModal} />
      )}
      <main className="mx-auto max-w-[1960px] p-4">
        {/* Bento grid: hero takes first 2×2 block, gallery tiles fill the rest */}
        <div
          className="grid gap-4 w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gridAutoRows: "260px",
          }}
        >
          {/* ── Hero / info card ───────────────────────────────────────────── */}
          <div
            className="relative flex flex-col items-center justify-end gap-4 overflow-hidden rounded-2xl px-6 pb-10 text-center shadow-highlight"
            style={{ gridColumn: "span 2", gridRow: "span 2" }}
          >
            {/* Background: real cover image or fallback SVG */}
            {heroCoverImage ? (
              <Image
                src={heroCoverImage.url}
                alt="Gallery cover"
                fill
                className="object-cover"
                placeholder={heroCoverImage.blurDataUrl ? "blur" : "empty"}
                blurDataURL={heroCoverImage.blurDataUrl ?? undefined}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span className="flex max-h-full max-w-full items-center justify-center">
                  <Bridge />
                </span>
              </div>
            )}
            {/* Dark gradient overlay */}
            <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Logo />
              <p className="max-w-[40ch] sm:max-w-[32ch] text-sm text-white/80">
                A simple image gallery application that allows you to upload and
                view images.
              </p>
              {isPending ? (
                <div className="mt-4 text-white">Loading...</div>
              ) : session ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2 mt-4 items-center">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 bg-white text-neutral-900 font-semibold text-sm rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </div>
                  <Button
                    onClick={() => authClient.signOut()}
                    variant="link"
                    className="text-destructive cursor-pointer"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="pointer mt-4 rounded-lg border border-white px-3 py-2 text-sm font-semibold transition"
                >
                  Sign in to Upload
                </button>
              )}
            </div>
          </div>

          {/* Gallery bento tiles */}
          {galleries.map((gallery) => {
            const coverImage = gallery.images[0];
            return (
              <Link
                href={`/@${gallery.slug}`}
                key={gallery.id}
                className="group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md hover:shadow-xl transition-shadow duration-300"
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
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-500 text-xs">
                    No images yet
                  </div>
                )}

                {/* Overlay + gallery name label */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {gallery.name}
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
