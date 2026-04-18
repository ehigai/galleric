import { Image } from "@/prisma/generated/prisma/client";

export interface SharedModalProps {
  index: number;
  images?: Image[] | [];
  currentPhoto?: Image;
  changePhotoId: (newVal: string) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}
