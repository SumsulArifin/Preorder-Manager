import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10));

    const where: Prisma.PreorderWhereInput = {};
    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const validSortFields = ["name", "createdAt", "startsAt", "endsAt"] as const;
    type SortField = (typeof validSortFields)[number];
    const actualSortBy = validSortFields.includes(sortBy as SortField)
      ? (sortBy as SortField)
      : "createdAt";
    const actualOrder = order === "asc" ? "asc" : "desc";

    const orderBy: Prisma.PreorderOrderByWithRelationInput = {
      [actualSortBy]: actualOrder,
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

    return NextResponse.json({
      data: preorders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching preorders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, products, preorderWhen, startsAt, endsAt, isActive } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!startsAt) {
      return NextResponse.json(
        { error: "Starts at is required" },
        { status: 400 }
      );
    }

    const preorder = await prisma.preorder.create({
      data: {
        name: name.trim(),
        products: typeof products === "number" ? products : 1,
        preorderWhen: preorderWhen || "regardless-of-stock",
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    return NextResponse.json(preorder, { status: 201 });
  } catch (error) {
    console.error("Error creating preorder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
