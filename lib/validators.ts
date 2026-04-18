const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_SLUG = 3;
const MAX_SLUG = 48;
const MAX_NAME = 80;

export type GalleryFormErrors = {
  name?: string;
  slug?: string;
};

export type GalleryFormData = {
  name: string;
  slug: string;
};

type ValidationResult =
  | { ok: true; data: GalleryFormData }
  | { ok: false; errors: GalleryFormErrors };

/**
 * Validates the name and slug fields from a gallery creation FormData.
 *
 * Returns `{ ok: true, data }` when both fields are valid, or
 * `{ ok: false, errors }` with per-field messages when not.
 */
export function validateGalleryFormData(formData: FormData): ValidationResult {
  const rawName = (formData.get("name") as string | null) ?? "";
  const rawSlug = (formData.get("slug") as string | null) ?? "";

  const name = rawName.trim();
  const slug = rawSlug.trim().toLowerCase();

  const errors: GalleryFormErrors = {};

  // Name
  if (name === "") {
    errors.name = "Gallery name is required.";
  } else if (name.length > MAX_NAME) {
    errors.name = `Gallery name must be ${MAX_NAME} characters or fewer.`;
  }

  // Slug
  if (slug === "") {
    errors.slug = "Gallery URL is required.";
  } else if (slug.length < MIN_SLUG || slug.length > MAX_SLUG) {
    errors.slug = `Gallery URL must be between ${MIN_SLUG} and ${MAX_SLUG} characters.`;
  } else if (!SLUG_RE.test(slug)) {
    errors.slug =
      "Gallery URL can only contain lowercase letters, numbers, and hyphens.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { name, slug } };
}
