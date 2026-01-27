import { db } from "@/index";
import { products, productBrands, productPrices, orders, orderItems, OrderStatus } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, and, lte, gte, inArray, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const now = new Date();

    const activeRentals = await db
      .select({ productId: orderItems.productId })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(
        and(
          inArray(orders.status, [OrderStatus.Confirmed, OrderStatus.Active]),
          lte(orderItems.startDate, now),
          gte(orderItems.endDate, now)
        )
      );

    const unavailableProductIds = new Set(activeRentals.map((r) => r.productId));

    const cars = await db.query.products.findMany({
      with: {
        productBrands: {
          with: {
            brand: true,
          },
        },
        productPrices: {
          with: {
            pricingType: true,
          },
        },
      },
      orderBy: [desc(products.id)],
    });

    // Transform data for frontend
    const formattedCars = cars.map((car) => ({
      id: car.id,
      modelName: car.modelName,
      image: car.image,
      brandId: car.productBrands[0]?.brandId || null,
      brandName: car.productBrands[0]?.brand?.name || null,
      prices: car.productPrices.map((pp) => ({
        pricingTypeId: pp.pricingTypeId,
        price: pp.price,
        name: pp.pricingType.name,
      })),
      isAvailable: !unavailableProductIds.has(car.id),
    }));

    return NextResponse.json(formattedCars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { modelName, image, brandId, prices } = body;
    // prices: { [pricingTypeId]: price }

    if (!modelName) {
      return NextResponse.json({ error: "Model name is required" }, { status: 400 });
    }

    const newCar = await db.transaction(async (tx) => {
      // 1. Create Product
      const [product] = await tx.insert(products).values({
        modelName,
        image,
      }).returning();

      // 2. Link Brand
      if (brandId) {
        await tx.insert(productBrands).values({
          productId: product.id,
          brandId: brandId,
        });
      }

      // 3. Add Prices
      if (prices && Object.keys(prices).length > 0) {
        const priceEntries = Object.entries(prices).map(([typeId, amount]) => ({
          productId: product.id,
          pricingTypeId: typeId,
          price: Number(amount),
        }));
        
        if (priceEntries.length > 0) {
           await tx.insert(productPrices).values(priceEntries);
        }
      }

      // Return complete object
      const createdCar = await tx.query.products.findFirst({
        where: eq(products.id, product.id),
        with: {
          productBrands: { with: { brand: true } },
          productPrices: { with: { pricingType: true } },
        },
      });
      return createdCar;
    });

    // Format response
    const formattedCar = {
      id: newCar?.id,
      modelName: newCar?.modelName,
      image: newCar?.image,
      brandId: newCar?.productBrands[0]?.brandId || null,
      brandName: newCar?.productBrands[0]?.brand?.name || null,
      prices: newCar?.productPrices.map((pp) => ({
        pricingTypeId: pp.pricingTypeId,
        price: pp.price,
        name: pp.pricingType.name,
      })),
    };

    return NextResponse.json(formattedCar);
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}