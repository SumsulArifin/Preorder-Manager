import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PreorderForm from "@/components/PreorderForm";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPreorderPage({ params }: EditPageProps) {
  const { id } = await params;
  const preorder = await prisma.preorder.findUnique({ where: { id } });

  if (!preorder) {
    notFound();
  }

  const initialData = {
    id: preorder.id,
    name: preorder.name,
    products: preorder.products,
    preorderWhen: preorder.preorderWhen,
    startsAt: preorder.startsAt.toISOString(),
    endsAt: preorder.endsAt?.toISOString() ?? "",
    isActive: preorder.isActive,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ebebeb" }}>
      <div className="mx-auto py-10" style={{ maxWidth: "860px" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="preorder-form"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>

        <PreorderForm initialData={initialData} />
      </div>
    </div>
  );
}
