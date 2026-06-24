"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function FilterTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStatus = searchParams.get("status") || "all";

  const tabs = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  function handleTabClick(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleTabClick(tab.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            currentStatus === tab.value
              ? "bg-white border border-gray-200 text-gray-900 shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
