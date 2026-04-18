import ImageUploader from "@/components/UploadImages";
import { getImages } from "@/lib/db/image";
import GalleryClient from "./client";
import { ImageProps } from "@/types/type";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const images = await getImages(slug);

  return (
    <>
      <div className="mx-auto max-w-490 p-4">
        <h1 className="text-2xl font-bold">Gallery for @{slug}</h1>
        {images.length === 0 ? (
          <p>This gallery is empty, be the first to contribute.</p>
        ) : (
          <GalleryClient
            images={images as ImageProps[]}
            photoId={undefined}
          />
        )}
      </div>
      <div>
        <ImageUploader gallerySlug={slug} />
      </div>
    </>
  );
}
