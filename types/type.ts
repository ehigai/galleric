import { Image } from "@/prisma/generated/prisma/client";

export type ImageProps = Image & {
  gallery?: {
    name: string;
    slug: string;
  };
};
