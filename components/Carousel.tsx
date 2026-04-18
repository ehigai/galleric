"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import useKeypress from "react-use-keypress";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./SharedModal";
import Modal from "@/components/Modal";
import { useState, useEffect } from "react";
import { getPhotoBackUrl, clearPhotoBackUrl } from "./GalleryImageLink";

export default function Carousel({
  currentPhotoId,
  gallery,
}: {
  currentPhotoId: string;
  gallery: any;
}) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();
  const [activePhotoId, setActivePhotoId] = useState(currentPhotoId);

  useEffect(() => {
    setActivePhotoId(currentPhotoId);
  }, [currentPhotoId]);

  // Find the photo based on local state, NOT the initial prop
  const currentPhoto = gallery.images.find(
    (img: any) => img.id === activePhotoId,
  );

  if (!currentPhoto) return null;

  function closeModal() {
    setLastViewedPhoto(currentPhoto.id.toString());
    const backUrl = getPhotoBackUrl() ?? `/@${gallery.slug}`;
    clearPhotoBackUrl();
    router.push(backUrl, { scroll: false });
  }

  function changePhotoId(newVal: string) {
    setActivePhotoId(newVal);
    window.history.pushState(null, "", `/@${gallery.slug}/${newVal}`);
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  const photoId = currentPhoto.id;
  const index = gallery.images.findIndex(
    (img: any) => img.id === activePhotoId,
  );

  return (
    <>
      {photoId && (
        <Modal
          images={gallery.images}
          gallerySlug={gallery.slug}
          onClose={() => {
            setLastViewedPhoto(photoId as string);
          }}
        />
      )}
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          className="absolute inset-0 z-30 cursor-default bg-black/90 backdrop-blur-3xl"
          onClick={closeModal}
        >
          {currentPhoto.blurDataUrl && (
            <Image
              src={currentPhoto.blurDataUrl}
              className="pointer-events-none h-full w-full"
              alt="blurred background"
              fill
              priority={true}
            />
          )}
        </button>
        <SharedModal
          index={index}
          changePhotoId={changePhotoId}
          currentPhoto={currentPhoto}
          closeModal={closeModal}
          navigation={false}
        />
      </div>
    </>
  );
}
