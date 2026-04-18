import { verifySession } from "@/lib/dal";
import {
  canUserCreateGallery,
  canUserUpdateGallery,
} from "@/lib/permissions/gallery";
import { getUserPermissions } from "@/lib/permissions/getUserPermissions";
import prisma from "@/lib/prisma";
import { GalleryFormErrors } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export type UpdateGallerySettingsState =
  | null
  | { errors: GalleryFormErrors }
  | {
      slug: string;
      settings?: { isPublic: boolean; allowContribute: boolean };
    };

export async function _updateGallerySettings(
  slug: string,
  data: { isPublic: boolean; allowContribute: boolean },
) {
  // Get the current user
  const { user } = await verifySession();

  // Fetch the target gallery from the database
  const gallery = await prisma.gallery.findUnique({
    where: { slug },
  });

  if (!gallery) {
    throw new Error("Gallery not found");
  }

  // Build the CASL ability and check permissions
  const ability = getUserPermissions({ id: user.id });

  if (!canUserUpdateGallery(ability, gallery)) {
    throw new Error("You do not have permission to update this gallery");
  }

  await prisma.gallery.update({
    where: { slug, ownerId: user.id }, // Redundancy is good? lol.
    data,
  });

  revalidatePath(`/dashboard/gallery/${slug}`, "layout");

  return {
    slug,
    settings: data,
  };
}

export async function _createGallery(data: { slug: string; name: string }) {
  const { user } = await verifySession();
  const ability = getUserPermissions({ id: user.id });

  if (!canUserCreateGallery(ability)) {
    throw new Error("You do not have permission to create a gallery");
  }

  const { slug, name } = data;

  // Check uniqueness before insert to avoid leaking a Prisma constraint error.
  const duplicate = await prisma.gallery.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (duplicate) {
    return {
      errors: {
        slug: "That gallery URL is already taken. Please choose another.",
      } satisfies GalleryFormErrors,
    };
  }

  const gallery = await prisma.gallery.create({
    data: { slug, name, owner: { connect: { id: user.id } } },
  });

  revalidatePath(`/dashboard/gallery/${slug}`, "layout");

  return { slug };
}
