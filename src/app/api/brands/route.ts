import { db } from "@/index";
import { brands } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allBrands = await db.select().from(brands).orderBy(desc(brands.name));
    return NextResponse.json(allBrands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, logo } = body;

    if (!name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }

    const newBrand = await db.insert(brands).values({
      name,
      logo,
    }).returning();

    return NextResponse.json(newBrand[0]);
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
