import Carousel from "@/components/Carousel";
import { getGalleryBySlug } from "@/lib/db/gallery";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ photoId: string; slug: string }>;
}) {
  const { photoId, slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) return null;

  return (
    <main className="mx-auto max-w-490 p-4">
      <Carousel currentPhotoId={photoId} gallery={gallery} />
    </main>
  );
}
