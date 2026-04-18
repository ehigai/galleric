import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import { Prisma } from "@/prisma/generated/prisma/client";

type ImageProps = Prisma.ImageCreateManyInput;
const cache = new Map<ImageProps, string>();

// 1×1 transparent GIF used as a fallback when blur placeholder generation fails
const FALLBACK_BLUR =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default async function getBase64ImageUrl(
  image: ImageProps,
): Promise<string> {
  let url = cache.get(image);
  if (url) {
    return url;
  }

  try {
    const response = await fetch(image.url);

    if (!response.ok) {
      console.warn(
        `[generateBlurPlaceholder] HTTP ${response.status} for ${image.publicId}`,
      );
      return FALLBACK_BLUR;
    }

    const buffer = await response.arrayBuffer();
    const minified = await imagemin.buffer(Buffer.from(buffer) as any, {
      plugins: [imageminJpegtran()],
    });

    url = `data:image/jpeg;base64,${Buffer.from(minified).toString("base64")}`;
    cache.set(image, url);
    return url;
  } catch (err) {
    console.error(
      `[generateBlurPlaceholder] fetch failed for ${image.publicId}:`,
      err,
    );
    return FALLBACK_BLUR;
  }
}
