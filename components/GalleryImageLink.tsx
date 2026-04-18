"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BACK_URL_KEY = "photo-back-url";

export function setPhotoBackUrl(url: string) {
  sessionStorage.setItem(BACK_URL_KEY, url);
}

export function getPhotoBackUrl(): string | null {
  return sessionStorage.getItem(BACK_URL_KEY);
}

export function clearPhotoBackUrl() {
  sessionStorage.removeItem(BACK_URL_KEY);
}

/**
 * Wraps a Next.js Link and saves the current path to sessionStorage
 * so the photo modal knows where to return when closed.
 */
export default function GalleryImageLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={() => setPhotoBackUrl(pathname)}
    >
      {children}
    </Link>
  );
}
