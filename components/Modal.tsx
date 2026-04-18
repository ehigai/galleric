"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import useKeypress from "react-use-keypress";
import SharedModal from "./SharedModal";
import { ImageProps } from "@/types/type";

import { getPhotoBackUrl, clearPhotoBackUrl } from "./GalleryImageLink";

export default function Modal({
  images,
  onClose,
  gallerySlug,
}: {
  images: ImageProps[];
  onClose?: () => void;
  gallerySlug: string;
}) {
  let overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const initialPhotoId = pathname.split("/").pop() || "";
  const [activePhotoId, setActivePhotoId] = useState(initialPhotoId);
  const [direction, setDirection] = useState(0);

  // Keep state synced if the user navigates using browser Back/Forward buttons
  useEffect(() => {
    const currentUrlId = pathname.split("/").pop() || "";
    if (currentUrlId && currentUrlId !== activePhotoId) {
      setActivePhotoId(currentUrlId);
    }
  }, [pathname]);

  const activeIndex = images.findIndex((img) => img.id === activePhotoId);
  const safeIndex = activeIndex > -1 ? activeIndex : 0;

  function handleClose() {
    const backUrl = getPhotoBackUrl() ?? `/@${gallerySlug}`;
    clearPhotoBackUrl();
    router.push(backUrl, { scroll: false });
    onClose?.();
  }

  function changePhotoId(newPhotoId: string) {
    const newIndex = images.findIndex((img) => img.id === newPhotoId);

    if (newIndex > safeIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }

    // Update UI instantly
    setActivePhotoId(newPhotoId);
    window.history.pushState(null, "", `/@${gallerySlug}/p/${newPhotoId}`);
  }

  useKeypress("ArrowRight", () => {
    if (safeIndex + 1 < images.length) {
      changePhotoId(images[safeIndex + 1].id);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (safeIndex > 0) {
      changePhotoId(images[safeIndex - 1].id);
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div as any}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={safeIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  );
}
