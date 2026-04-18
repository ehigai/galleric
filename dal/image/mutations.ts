import { verifySession } from "@/lib/dal";
import {
  canUserContributeToGallery,
  canUserUpdateGallery,
  canUserDeleteGallery,
} from "@/lib/permissions/gallery";
import { getUserPermissions } from "@/lib/permissions/getUserPermissions";
import prisma from "@/lib/prisma";
import cloudinary from "@/utils/cloudinary";
import getBase64ImageUrl from "@/utils/generateBlurPlaceholder";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

export async function _uploadAndSaveImages(
  formData: FormData,
  gallerySlug: string,
) {
  // Authenticate user
  const { user } = await verifySession();
  // Fetch gallery & validate permissions
  const gallery = await prisma.gallery.findUnique({
    where: { slug: gallerySlug },
  });

  if (!gallery) {
    return { success: false, error: "Gallery not found." };
  }

  // Determine if the user has permission to upload
  const ability = getUserPermissions({ id: user.id });

  if (!canUserContributeToGallery(ability, gallery)) {
    throw new Error(
      "Sorry this gallery does not allow contributions currently.",
    );
  }

  // Extract files
  const files = formData.getAll("images") as File[];
  if (!files || files.length === 0) {
    throw new Error("No files provided.");
  }

  // Upload to Cloudinary concurrently
  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `galleric/${gallery.slug}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        },
      );

      uploadStream.end(buffer);
    });
  });

  const uploadResults = await Promise.all(uploadPromises);

  // Format payload and save to DB
  const imagesData = uploadResults.map((res) => ({
    url: res.secure_url,
    publicId: res.public_id,
    galleryId: gallery.id,
    uploaderId: user.id,
  }));

  // Generate blur URLs BEFORE saving to the database
  const blurImagePromises = imagesData.map((image) => getBase64ImageUrl(image));
  const blurDataUrls = await Promise.all(blurImagePromises);

  // Attach the blur URLs to your payload
  const finalImagesData = imagesData.map((image, index) => ({
    ...image,
    blurDataUrl: blurDataUrls[index],
    isCover: index === 0,
  }));

  // Save to DB and return the actual records
  const savedImages = await prisma.image.createManyAndReturn({
    data: finalImagesData,
  });

  revalidatePath(`/gallery/${gallerySlug}`);
  revalidatePath(`/dashboard/gallery/${gallerySlug}`);
  revalidatePath(`/`);

  return { success: true, data: savedImages };
}

export async function _setCoverImage(imageId: string, gallerySlug: string) {
  const { user } = await verifySession();

  const gallery = await prisma.gallery.findUnique({
    where: { slug: gallerySlug },
  });
  if (!gallery) throw new Error("Gallery not found.");

  const ability = getUserPermissions({ id: user.id });
  if (!canUserUpdateGallery(ability, gallery)) {
    throw new Error("You do not have permission to update this gallery.");
  }

  // Unset any existing cover, then set the new one atomically
  await prisma.$transaction([
    prisma.image.updateMany({
      where: { galleryId: gallery.id, isCover: true },
      data: { isCover: false },
    }),
    prisma.image.update({
      where: { id: imageId },
      data: { isCover: true },
    }),
  ]);

  revalidatePath(`/dashboard/gallery/${gallerySlug}`);
  revalidatePath(`/dashboard/gallery/${gallerySlug}/settings`);
  revalidatePath(`/@${gallerySlug}`);
  revalidatePath(`/`);

  return { success: true };
}

export async function _deleteImage(imageId: string) {
  const { user } = await verifySession();

  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: { gallery: true },
  });
  if (!image) throw new Error("Image not found.");

  const ability = getUserPermissions({ id: user.id });
  const canDelete =
    ability.can("delete", "Image") ||
    image.uploaderId === user.id ||
    image.gallery.ownerId === user.id;

  if (!canDelete)
    throw new Error("You do not have permission to delete this image.");

  // Delete from Cloudinary first
  await cloudinary.uploader.destroy(image.publicId);

  await prisma.image.delete({ where: { id: imageId } });

  const slug = image.gallery.slug;
  revalidatePath(`/dashboard/gallery/${slug}`);
  revalidatePath(`/dashboard/gallery/${slug}/settings`);
  revalidatePath(`/@${slug}`);
  revalidatePath(`/`);

  return { success: true };
}

export async function _clearGallery(gallerySlug: string) {
  const { user } = await verifySession();

  const gallery = await prisma.gallery.findUnique({
    where: { slug: gallerySlug },
    include: { images: true },
  });
  if (!gallery) throw new Error("Gallery not found.");

  const ability = getUserPermissions({ id: user.id });
  if (!canUserUpdateGallery(ability, gallery)) {
    throw new Error("You do not have permission to clear this gallery.");
  }

  // Delete all images from Cloudinary concurrently
  if (gallery.images.length > 0) {
    await Promise.all(
      gallery.images.map((img) => cloudinary.uploader.destroy(img.publicId)),
    );
    await prisma.image.deleteMany({ where: { galleryId: gallery.id } });
  }

  revalidatePath(`/dashboard/gallery/${gallerySlug}`);
  revalidatePath(`/dashboard/gallery/${gallerySlug}/settings`);
  revalidatePath(`/@${gallerySlug}`);
  revalidatePath(`/`);

  return { success: true };
}

export async function _deleteGallery(gallerySlug: string) {
  const { user } = await verifySession();

  const gallery = await prisma.gallery.findUnique({
    where: { slug: gallerySlug },
    include: { images: true },
  });
  if (!gallery) throw new Error("Gallery not found.");

  const ability = getUserPermissions({ id: user.id });
  if (!canUserDeleteGallery(ability, gallery)) {
    throw new Error("You do not have permission to delete this gallery.");
  }

  // Delete all images from Cloudinary concurrently first
  if (gallery.images.length > 0) {
    await Promise.all(
      gallery.images.map((img) => cloudinary.uploader.destroy(img.publicId)),
    );
  }

  // Deleting the gallery cascades image deletion in the DB (schema: onDelete: Cascade)
  await prisma.gallery.delete({ where: { id: gallery.id } });

  revalidatePath(`/`);
  revalidatePath(`/dashboard`);

  return { success: true };
}
