import prisma from "../prisma";

export async function getImages(gallerySlug: string) {
  return prisma.image.findMany({
    where: {
      gallery: {
        slug: gallerySlug,
      },
    },
    include: {
      gallery: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function getImage(imageId: string) {
  return prisma.image.findFirst({
    where: { id: imageId },
    include: { gallery: { select: { name: true, slug: true } } },
  });
}
