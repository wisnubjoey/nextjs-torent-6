import { NextResponse } from "next/server";
import { db } from "@/index";
import { products, productBrands, productPrices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { modelName, image, brandId, prices } = body;

    const updatedCar = await db.transaction(async (tx) => {
      // 1. Update Product Details
      await tx
        .update(products)
        .set({
          modelName,
          image,
        })
        .where(eq(products.id, id));

      // 2. Update Brand (Delete existing, insert new)
      await tx.delete(productBrands).where(eq(productBrands.productId, id));
      if (brandId) {
        await tx.insert(productBrands).values({
          productId: id,
          brandId: brandId,
        });
      }

      // 3. Update Prices (Delete existing, insert new)
      await tx.delete(productPrices).where(eq(productPrices.productId, id));
      if (prices && Object.keys(prices).length > 0) {
        const priceEntries = Object.entries(prices).map(([typeId, amount]) => ({
          productId: id,
          pricingTypeId: typeId,
          price: Number(amount),
        }));
        
        if (priceEntries.length > 0) {
            await tx.insert(productPrices).values(priceEntries);
        }
      }

      // Fetch updated
      return await tx.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            productBrands: { with: { brand: true } },
            productPrices: { with: { pricingType: true } },
        },
      });
    });

    if (!updatedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const formattedCar = {
        id: updatedCar.id,
        modelName: updatedCar.modelName,
        image: updatedCar.image,
        brandId: updatedCar.productBrands[0]?.brandId || null,
        brandName: updatedCar.productBrands[0]?.brand?.name || null,
        prices: updatedCar.productPrices.map((pp) => ({
          pricingTypeId: pp.pricingTypeId,
          price: pp.price,
          name: pp.pricingType.name,
        })),
    };

    return NextResponse.json(formattedCar);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Drizzle cascade delete should handle relations if set up in DB, 
    // but explicit delete is safer if cascades aren't reliable
    // Schema says "onDelete: cascade" so we just delete the product.

    const deletedCar = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (deletedCar.length === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(deletedCar[0]);
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}