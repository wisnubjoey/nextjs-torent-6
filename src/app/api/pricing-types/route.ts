import { db } from "@/index";
import { pricingTypes } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const types = await db.select().from(pricingTypes);
    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching pricing types:", error);
    return NextResponse.json({ error: "Failed to fetch pricing types" }, { status: 500 });
  }
}
