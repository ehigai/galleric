"use server";

import { _uploadAndSaveImages, _setCoverImage, _deleteImage, _clearGallery, _deleteGallery } from "@/dal/image/mutations";

export async function uploadAndSaveImages(
  formData: FormData,
  gallerySlug: string,
) {
  try {
    return await _uploadAndSaveImages(formData, gallerySlug);
  } catch (error) {
    console.error("Image upload/save failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while processing the images.",
    };
  }
}

export async function setCoverImage(imageId: string, gallerySlug: string) {
  try {
    return await _setCoverImage(imageId, gallerySlug);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set cover image.",
    };
  }
}

export async function deleteImage(imageId: string) {
  try {
    return await _deleteImage(imageId);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image.",
    };
  }
}

export async function clearGallery(gallerySlug: string) {
  try {
    return await _clearGallery(gallerySlug);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear gallery.",
    };
  }
}

export async function deleteGallery(gallerySlug: string) {
  try {
    return await _deleteGallery(gallerySlug);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete gallery.",
    };
  }
}
