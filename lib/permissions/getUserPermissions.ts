import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import type { User, Gallery, Image } from "@/prisma/generated/prisma/client";

type GallerySubject = Pick<Gallery, "ownerId" | "isPublic" | "allowContribute">;
type ImageSubject = Pick<Image, "uploaderId" | "galleryId"> & {
  gallery?: Partial<GallerySubject>;
};

export type AppAction =
  | "view"
  | "contribute"
  | "create"
  | "update"
  | "delete"
  | "manage";

export type AppSubject =
  | "Gallery"
  | GallerySubject
  | "Image"
  | ImageSubject
  | "all";

export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

/**
 * Builds the CASL ability for a given user.
 * * @param user - The currently authenticated User object, or null/undefined if a guest.
 * @returns A compiled AppAbility instance to evaluate permissions.
 */
export const getUserPermissions = (
  user?: Pick<User, "id"> | null,
): AppAbility => {
  const { build, can } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can("view", "Gallery", { isPublic: true });
  can("view", "Image", { gallery: { isPublic: true } });

  if (user) {
    // Gallery Owner: Full control over their gallery and its nested images
    can("manage", "Gallery", { ownerId: user.id });
    can("manage", "Image", { gallery: { ownerId: user.id } });

    // Public Contributor: Can contribute to galleries explicitly marked for it
    can("contribute", "Gallery", { ownerId: user.id });
    can("contribute", "Gallery", { allowContribute: true, isPublic: true });

    // Image Uploader: Can edit/delete only the specific images they uploaded
    can(["update", "delete"], "Image", { uploaderId: user.id });
  }

  return build();
};
