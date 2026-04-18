"use server";

/**
 * Gallery Server Actions
 *
 * This file MUST stay separate from lib/gallery.ts so that the
 * file-level "use server" directive prevents Next.js from bundling
 * prisma (and its pg/dns dependencies) for the browser.
 */

import { GalleryFormErrors, validateGalleryFormData } from "../lib/validators";
import {
  _createGallery,
  _updateGallerySettings,
  UpdateGallerySettingsState,
} from "@/dal/gallery/mutations";

export type CreateGalleryState =
  | null
  | { errors: GalleryFormErrors }
  | {
      slug: string;
      settings?: { isPublic: boolean; allowContribute: boolean };
    };

export async function createGallery(
  _prev: CreateGalleryState,
  formData: FormData,
): Promise<CreateGalleryState> {
  const result = validateGalleryFormData(formData);
  if (!result.ok) {
    return { errors: result.errors };
  }

  try {
    return await _createGallery(result.data);
  } catch (error) {
    return {
      errors: {
        slug: "Failed to create gallery. Make sure you have permission.",
      },
    };
  }
}

export async function updateGallerySettings(
  _prev: UpdateGallerySettingsState,
  formData: FormData,
): Promise<UpdateGallerySettingsState> {
  const isPublic = formData.get("isPublic") === "on";
  const allowContribute = formData.get("allowContribution") === "on";
  const slug = formData.get("slug") as string;

  if (!slug) return null;

  try {
    return await _updateGallerySettings(slug, {
      isPublic,
      allowContribute,
    });
  } catch (error) {
    return {
      errors: {
        slug: "Failed to update settings. Make sure you have permission.",
      },
    };
  }
}
