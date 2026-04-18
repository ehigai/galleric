import HomeClient from "@/components/HomeClient";
import { getGalleries } from "@/lib/db/gallery";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ photoId?: string }>;
}) {
  const galleries = await getGalleries();

  return (
    <HomeClient galleries={galleries} photoId={(await searchParams).photoId} />
  );
}
