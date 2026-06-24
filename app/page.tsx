import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import FilterTabs from "@/components/FilterTabs";
import SortPopover from "@/components/SortPopover";
import PreorderTable from "@/components/PreorderTable";
import PaginationComponent from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const VALID_SORT_FIELDS = ["name", "createdAt", "startsAt", "endsAt"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

function parseSortBy(value: unknown): SortField {
  if (typeof value === "string" && VALID_SORT_FIELDS.includes(value as SortField)) {
    return value as SortField;
  }
  return "createdAt";
}

function parseOrder(value: unknown): "asc" | "desc" {
  if (value === "asc") return "asc";
  return "desc";
}

function parsePage(value: unknown): number {
  const n = typeof value === "string" ? parseInt(value, 10) : NaN;
  return isNaN(n) || n < 1 ? 1 : n;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = (typeof params.status === "string" ? params.status : "all") as
    | "all"
    | "active"
    | "inactive";
  const sortBy = parseSortBy(params.sortBy);
  const order = parseOrder(params.order);
  const page = parsePage(params.page);
  const pageSize = 10;

  const where: Prisma.PreorderWhereInput = {};
  if (status === "active") where.isActive = true;
  if (status === "inactive") where.isActive = false;

  const orderBy: Prisma.PreorderOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const skip = (page - 1) * pageSize;

  const [preorders, total] = await Promise.all([
    prisma.preorder.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.preorder.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ebebeb" }}>
      <div className="mx-auto py-10" style={{ maxWidth: "860px" }}>
        {/* Top row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-bold text-gray-900">Preorders</h1>
          <Link
            href="/preorders/new"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Create Preorder
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Filter and Sort bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <Suspense fallback={<div className="h-8" />}>
              <FilterTabs />
            </Suspense>
            <Suspense fallback={<div className="h-8 w-8" />}>
              <SortPopover />
            </Suspense>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <PreorderTable
              preorders={preorders.map((p) => ({
                ...p,
                startsAt: p.startsAt.toISOString(),
                endsAt: p.endsAt?.toISOString() ?? null,
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString(),
              }))}
            />
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100">
            <Suspense fallback={<div className="h-10" />}>
              <PaginationComponent
                total={total}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
