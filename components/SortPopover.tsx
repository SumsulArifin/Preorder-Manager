"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Created At", value: "createdAt" },
  { label: "Starts At", value: "startsAt" },
  { label: "Ends At", value: "endsAt" },
];

export default function SortPopover() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentOrder = searchParams.get("order") || "desc";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function updateParams(sortBy: string, order: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("order", order);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        aria-label="Sort options"
      >
        <ArrowUpDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
            Sort by
          </p>

          <div className="space-y-1 mb-3">
            {sortOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer text-sm"
              >
                <input
                  type="radio"
                  name="sortBy"
                  value={opt.value}
                  checked={currentSortBy === opt.value}
                  onChange={() => updateParams(opt.value, currentOrder)}
                  className="accent-gray-900"
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => updateParams(currentSortBy, "asc")}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentOrder === "asc"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ↑ Ascending
            </button>
            <button
              type="button"
              onClick={() => updateParams(currentSortBy, "desc")}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentOrder === "desc"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ↓ Descending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
