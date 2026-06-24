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

  async function handleToggle() {
    const newState = !active;
    setActive(newState);

    try {
      const res = await fetch(`/api/preorders/${id}/status`, {
        method: "PATCH",
      });

      if (!res.ok) {
        setActive(!newState);
      }

      router.refresh();
    } catch {
      setActive(!newState);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        active ? "bg-gray-900" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          active ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
