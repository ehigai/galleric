"use client";

import { useFormStatus } from "react-dom";
import Button from "./Button";

export function SubmitButton() {
  // This hook reads the status of the parent <form>
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Settings"}
    </Button>
  );
}
