"use client";

import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "@/utils/animationVariants";
import downloadPhoto from "../utils/downloadPhoto";
import type { SharedModalProps } from "@/utils/types";
import Twitter from "./Icons/Twitter";

export default function SharedModal({
                                      index,
                                      images,
                                      changePhotoId,
                                      closeModal,
                                      navigation,
                                      currentPhoto,
                                      direction,
                                    }: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  // Safely grab the current domain for the Twitter share link
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const currentImage = images ? images[index] : currentPhoto;

  const windowedImages = images?.slice(
      Math.max(0, index - 15),
      Math.min(images.length, index + 15)
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (images && index < images.length - 1) {
        changePhotoId(images[index + 1].id);
      }
    },
    onSwipedRight: () => {
      if (images && index > 0) {
        changePhotoId(images[index - 1].id);
      }
    },
    trackMouse: true,
  });

  return (
      <MotionConfig
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
      >
        <div
            className="relative z-50 flex aspect-3/2 w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
            {...handlers}
        >
          {/* Main image */}
          <div className="w-full overflow-hidden">
            <div className="relative flex aspect-3/2 items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentImage?.id || index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute"
                >
                  <Image
                      src={currentImage?.url || ""}
                      width={navigation ? 1280 : 1920}
                      height={navigation ? 853 : 1280}
                      priority
                      alt="Galleric image"
                      onLoad={() => setLoaded(true)}
                      // Optional: Handle errors so the user isn't staring at a blank space
                      onError={() => setLoaded(true)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Buttons + bottom nav bar */}
          <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
            {/* FIX 1: Removed the {loaded && (...)} wrapper around the entire UI controls */}
            <div className="relative aspect-3/2 max-h-full w-full">
              {navigation && images && (
                  <>
                    {index > 0 && (
                        <button
                            className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                            style={{ transform: "translate3d(0, 0, 0)" }}
                            onClick={() => changePhotoId(images[index - 1].id)}
                        >
                          <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                    )}
                    {index + 1 < images.length && (
                        <button
                            className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                            style={{ transform: "translate3d(0, 0, 0)" }}
                            onClick={() => changePhotoId(images[index + 1].id)}
                        >
                          <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    )}
                  </>
              )}

              <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white">
                {navigation ? (
                    <a
                        href={currentImage?.url || ""}
                        className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                        target="_blank"
                        title="Open fullsize version"
                        rel="noreferrer"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    </a>
                ) : (
                    <a
                        // FIX 2: Removed hardcoded "yourdomain.com" to use actual domain dynamically
                        href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20pic!%0A%0A${currentOrigin}/p/${currentImage?.id}`}
                        className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                        target="_blank"
                        title="Share on Twitter"
                        rel="noreferrer"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                )}
                <button
                    onClick={() =>
                        downloadPhoto(
                            currentImage?.url || "",
                            `${currentImage?.id}.jpg`
                        )
                    }
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white">
                <button
                    onClick={() => closeModal()}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                >
                  {navigation ? (
                      <XMarkIcon className="h-5 w-5" />
                  ) : (
                      <ArrowUturnLeftIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Nav bar - Wrap this in the loaded state if you only want thumbnails to appear after main image loads, otherwise let it render freely */}
            {loaded && navigation && windowedImages && (
                <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-linear-to-b from-black/0 to-black/60">
                  <motion.div
                      initial={false}
                      className="mx-auto mt-6 mb-6 flex aspect-3/2 h-14"
                  >
                    <AnimatePresence initial={false}>
                      {windowedImages.map((image) => {
                        const isActive = image.id === currentImage?.id;
                        const isFirst = images && image.id === images[0].id;
                        const isLast = images && image.id === images[images.length - 1].id;

                        return (
                            <motion.button
                                key={image.id}
                                initial={{
                                  width: "0%",
                                  x: `${Math.max((index - 1) * -100, 15 * -100)}%`,
                                }}
                                animate={{
                                  scale: isActive ? 1.25 : 1,
                                  width: "100%",
                                  x: `${Math.max(index * -100, 15 * -100)}%`,
                                }}
                                exit={{ width: "0%" }}
                                onClick={() => changePhotoId(image.id)}
                                className={`${
                                    isActive
                                        ? "z-20 rounded-md shadow shadow-black/50"
                                        : "z-10"
                                } ${isFirst ? "rounded-l-md" : ""} ${
                                    isLast ? "rounded-r-md" : ""
                                } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
                            >
                              <Image
                                  alt="small photos on the bottom"
                                  width={180}
                                  height={120}
                                  className={`${
                                      isActive
                                          ? "brightness-110 hover:brightness-110"
                                          : "brightness-50 contrast-125 hover:brightness-75"
                                  } h-full transform object-cover transition`}
                                  src={image.url}
                              />
                            </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </div>
            )}
          </div>
        </div>
      </MotionConfig>
  );
}