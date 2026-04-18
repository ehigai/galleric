"use client";

import { useState } from "react";
import CreateGalleryFormModal from "@/components/forms/CreateGalleryForm";
import Plus from "@/components/Icons/Plus";

export default function NewGalleryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <CreateGalleryFormModal setGalleryCreateModal={setOpen} />}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors"
      >
        <Plus width={15} height={15} />
        New Gallery
      </button>
    </>
  );
}
