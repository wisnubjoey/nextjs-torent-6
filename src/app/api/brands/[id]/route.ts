import { NextResponse } from "next/server";
import { db } from "@/index";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, logo } = body;

    const updatedBrand = await db
      .update(brands)
      .set({
        name,
        logo,
      })
      .where(eq(brands.id, id))
      .returning();

    if (updatedBrand.length === 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBrand[0]);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedBrand = await db
      .delete(brands)
      .where(eq(brands.id, id))
      .returning();

    if (deletedBrand.length === 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(deletedBrand[0]);
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
