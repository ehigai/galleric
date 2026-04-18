import { Prisma } from "@/prisma/generated/prisma/client";
import prisma from "../prisma";
import { verifySession } from "../dal";

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getGalleryBySlug(slug: string) {
  return prisma.gallery.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });
}

export async function updateGallery(
  id: string,
  data: Prisma.GalleryUpdateInput,
) {
  return prisma.gallery.update({ where: { id }, data });
}

export async function deleteGallery(id: string) {
  return prisma.gallery.delete({ where: { id } });
}

export async function getGalleries() {
  const galleries = await prisma.gallery.findMany({
    include: {
      images: {
        where: {
          isCover: true,
        },
        take: 1,
      },
    },
  });
  if (!galleries) return [];
  return galleries;
}

export const getUserGalleries = async () => {
  const session = await verifySession();
  if (!session) {
    return null;
  }
  return prisma.gallery.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      images: true,
    },
  });
};
