"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLastViewedPhoto } from "@/utils/useLastViewedPhoto";
import Image from "next/image";
import { ImageProps } from "@/types/type";

export default function GalleryClient({
  images,
  photoId,
}: {
  images: ImageProps[];
  photoId?: string;
}) {
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <main className="mx-auto max-w-490 p-4">

        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          {images.map(({ id, url, blurDataUrl, gallery }, i) => (
            <Link
              key={id}
              href={`/@${gallery?.slug}/p/${id}`}
              ref={id === lastViewedPhoto ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt={`Image from Gallery: ${gallery?.name} | Galleric`}
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder={blurDataUrl ? "blur" : "empty"}
                blurDataURL={blurDataUrl || ""}
                src={url}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw"
              />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
