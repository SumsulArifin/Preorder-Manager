"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PreorderFormProps {
  initialData?: {
    id?: string;
    name: string;
    products: number;
    preorderWhen: string;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
  };
}

function toDatetimeLocal(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PreorderForm({ initialData }: PreorderFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name || "");
  const [products, setProducts] = useState(initialData?.products ?? 1);
  const [preorderWhen, setPreorderWhen] = useState(
    initialData?.preorderWhen || "regardless-of-stock"
  );
  const [startsAt, setStartsAt] = useState(
    initialData ? toDatetimeLocal(initialData.startsAt) : ""
  );
  const [endsAt, setEndsAt] = useState(
    initialData ? toDatetimeLocal(initialData.endsAt) : ""
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = "Name is required.";
    }
    if (!startsAt) {
      errs.startsAt = "Starts at is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        products,
        preorderWhen,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
        isActive,
      };

      const url = isEdit
        ? `/api/preorders/${initialData!.id}`
        : "/api/preorders";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error) {
          setErrors({ form: data.error });
        }
        setSaving(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setSaving(false);
    }
  }

  function handleCancel() {
    router.push("/");
  }

  return (
    <form id="preorder-form" onSubmit={handleSubmit}>
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.form}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-8 pt-6 pb-4">
          <h2 className="text-lg font-bold text-gray-900">Preorder details</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            These values appear in the preorders list.
          </p>
        </div>

        <div className="border-b border-gray-100" />

        {/* Name */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex">
            <div className="w-[280px] shrink-0">
              <label className="font-semibold text-sm text-gray-900">
                Name<span className="text-red-500 ml-0.5">*</span>
              </label>
              <p className="text-gray-500 text-xs mt-1">
                A label to recognize this preorder by.
              </p>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Enter preorder name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex">
            <div className="w-[280px] shrink-0">
              <label className="font-semibold text-sm text-gray-900">
                Products
              </label>
              <p className="text-gray-500 text-xs mt-1">
                Number of products covered by this preorder.
              </p>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={products}
                onChange={(e) =>
                  setProducts(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">product(s)</span>
            </div>
          </div>
        </div>

        {/* Preorder when */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex">
            <div className="w-[280px] shrink-0">
              <label className="font-semibold text-sm text-gray-900">
                Preorder when
              </label>
              <p className="text-gray-500 text-xs mt-1">
                When customers are allowed to preorder.
              </p>
            </div>
            <div className="flex-1">
              <select
                value={preorderWhen}
                onChange={(e) => setPreorderWhen(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="regardless-of-stock">
                  regardless-of-stock
                </option>
                <option value="out-of-stock">out-of-stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Starts at */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex">
            <div className="w-[280px] shrink-0">
              <label className="font-semibold text-sm text-gray-900">
                Starts at
              </label>
              <p className="text-gray-500 text-xs mt-1">
                When the preorder window opens.
              </p>
            </div>
            <div className="flex-1">
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => {
                  setStartsAt(e.target.value);
                  if (errors.startsAt)
                    setErrors((prev) => ({ ...prev, startsAt: "" }));
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {errors.startsAt && (
                <p className="text-red-500 text-xs mt-1">{errors.startsAt}</p>
              )}
            </div>
          </div>
        </div>

        {/* Ends at */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex">
            <div className="w-[280px] shrink-0">
              <label className="font-semibold text-sm text-gray-900">
                Ends at
              </label>
              <p className="text-gray-500 text-xs mt-1">
                Leave empty for no end date.
              </p>
            </div>
            <div className="flex-1">
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="px-8 py-6">
          <div className="flex">
            <div className="w-[280px] shrink-0">
              <label className="font-semibold text-sm text-gray-900">
                Status
              </label>
              <p className="text-gray-500 text-xs mt-1">
                Active preorders are visible to customers.
              </p>
            </div>
            <div className="flex-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  isActive ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-[18px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center justify-end gap-3 mt-6 pb-12">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Save changes
        </button>
      </div>
    </form>
  );
}
