import { Gallery } from "@/prisma/generated/prisma/client";
import { subject } from "@casl/ability";
import type { AppAbility } from "./getUserPermissions";

// Gallery Checkers
export function canUserViewGallery(ability: AppAbility, gallery?: Gallery) {
  if (!gallery) return ability.can("view", "Gallery");
  return ability.can("view", subject("Gallery", gallery));
}

export function canUserCreateGallery(ability: AppAbility) {
  return ability.can("create", "Gallery");
}

export function canUserContributeToGallery(
  ability: AppAbility,
  gallery?: Gallery,
) {
  if (!gallery) return ability.can("contribute", "Gallery");
  return ability.can("contribute", subject("Gallery", gallery));
}

export function canUserUpdateGallery(ability: AppAbility, gallery?: Gallery) {
  if (!gallery) return ability.can("update", "Gallery");
  return ability.can("update", subject("Gallery", gallery));
}

export function canUserDeleteGallery(ability: AppAbility, gallery?: Gallery) {
  if (!gallery) return ability.can("delete", "Gallery");
  return ability.can("delete", subject("Gallery", gallery));
}

export function canUserManageGallery(ability: AppAbility, gallery?: Gallery) {
  if (!gallery) return ability.can("manage", "Gallery");
  return ability.can("manage", subject("Gallery", gallery));
}
