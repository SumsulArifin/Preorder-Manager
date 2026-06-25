"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import StatusToggle from "./StatusToggle";

interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PreorderTableProps {
  preorders: Preorder[];
}

export default function PreorderTable({ preorders }: PreorderTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const visibleIds = preorders.map((p) => p.id);

  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someSelected = visibleIds.some((id) => selectedIds.has(id));

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  function handleHeaderCheckbox() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleIds));
    }
  }

  function handleRowCheckbox(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const handleDelete = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirm("Delete this preorder?")) return;

      try {
        const res = await fetch(`/api/preorders/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          router.refresh();
        }
      } catch {
        // silently fail
      }
    },
    [router]
  );

  const formatDate = (date: string | Date | null) => {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy hh:mm a");
  };

  if (preorders.length === 0) {
    return (
      <table className="w-full">
        <thead>
          <tr className="text-gray-500 text-xs font-medium uppercase">
            <th className="w-10 px-4 py-3 text-left">
              <input
                type="checkbox"
                ref={headerCheckboxRef}
                checked={false}
                readOnly
                className="accent-gray-900"
              />
            </th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Products</th>
            <th className="px-4 py-3 text-left">Preorder when</th>
            <th className="px-4 py-3 text-left">Starts at</th>
            <th className="px-4 py-3 text-left">Ends at</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
              No preorders found.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="text-gray-500 text-xs font-medium uppercase">
          <th className="w-10 px-4 py-3 text-left">
            <input
              type="checkbox"
              ref={headerCheckboxRef}
              checked={allSelected}
              onChange={handleHeaderCheckbox}
              className="accent-gray-900"
            />
          </th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Products</th>
          <th className="px-4 py-3 text-left">Preorder when</th>
          <th className="px-4 py-3 text-left">Starts at</th>
          <th className="px-4 py-3 text-left">Ends at</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {preorders.map((preorder) => (
          <tr
            key={preorder.id}
            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedIds.has(preorder.id)}
                onChange={() => handleRowCheckbox(preorder.id)}
                className="accent-gray-900"
              />
            </td>
            <td className="px-4 py-3">
              <span className="font-semibold text-sm text-gray-900">
                {preorder.name}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {preorder.products}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {preorder.preorderWhen}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {formatDate(preorder.startsAt)}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {formatDate(preorder.endsAt)}
            </td>
            <td className="px-4 py-3">
              <StatusToggle id={preorder.id} isActive={preorder.isActive} />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => router.push(`/preorders/${preorder.id}/edit`)}
                  className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  aria-label="Edit preorder"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(preorder.id, e)}
                  className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  aria-label="Delete preorder"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
