"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface StatusToggleProps {
  id: string;
  isActive: boolean;
}

export default function StatusToggle({ id, isActive: initialActive }: StatusToggleProps) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleToggle() {
    if (isUpdating) return;
    
    const newState = !active;
    setActive(newState);
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/preorders/${id}/status`, {
        method: "PATCH",
      });

      if (!res.ok) {
        setActive(!newState);
      } else {
        router.refresh();
      }
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${active ? "bg-gray-900" : "bg-gray-300"} ${isUpdating ? "opacity-70" : ""}`}
      disabled={isUpdating}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${active ? "translate-x-[18px]" : "translate-x-[3px]"}`}
      />
    </button>
  );
}
