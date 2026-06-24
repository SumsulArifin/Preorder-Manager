import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const preorder = await prisma.preorder.findUnique({ where: { id } });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error fetching preorder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.preorder.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, products, preorderWhen, startsAt, endsAt, isActive } = body;

    const data: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }
      data.name = name.trim();
    }

    if (products !== undefined) {
      data.products = products;
    }

    if (preorderWhen !== undefined) {
      data.preorderWhen = preorderWhen;
    }

    if (startsAt !== undefined) {
      data.startsAt = new Date(startsAt);
    }

    if (endsAt !== undefined) {
      data.endsAt = endsAt ? new Date(endsAt) : null;
    }

    if (isActive !== undefined) {
      data.isActive = isActive;
    }

    const preorder = await prisma.preorder.update({
      where: { id },
      data,
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error updating preorder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.preorder.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 }
      );
    }

    await prisma.preorder.delete({ where: { id } });

    return NextResponse.json({ message: "Preorder deleted" });
  } catch (error) {
    console.error("Error deleting preorder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
