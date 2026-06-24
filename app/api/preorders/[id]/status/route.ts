import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

    const preorder = await prisma.preorder.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error toggling preorder status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
