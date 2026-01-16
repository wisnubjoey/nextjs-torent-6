import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/index";
import { orders, orderItems, productPrices, OrderStatus } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      pricingTypeId: z.string(),
      quantity: z.number().min(1),
      startDate: z.string().or(z.date()), // Accepts ISO string or Date object
      endDate: z.string().or(z.date()),   // Accepts ISO string or Date object
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = createOrderSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { items } = parsedBody.data;

    // Validate items and calculate total from DB
    let totalAmount = 0;
    const orderItemsData: { productId: string; pricingTypeId: string; quantity: number; priceSnapshot: number; startDate: Date; endDate: Date; }[] = [];

    // Use a transaction to ensure integrity
    const result = await db.transaction(async (tx) => {
      for (const item of items) {
        // Fetch price from DB to prevent client-side tampering
        const priceRecord = await tx.query.productPrices.findFirst({
          where: and(
            eq(productPrices.productId, item.productId),
            eq(productPrices.pricingTypeId, item.pricingTypeId)
          ),
        });

        if (!priceRecord) {
          throw new Error(`Price not found for product ${item.productId} and pricing type ${item.pricingTypeId}`);
        }

        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day/unit

        const itemTotal = priceRecord.price * diffDays * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId: item.productId,
          pricingTypeId: item.pricingTypeId,
          quantity: item.quantity,
          priceSnapshot: priceRecord.price,
          startDate: start,
          endDate: end,
        });
      }

      // Create Order
      const [newOrder] = await tx
        .insert(orders)
        .values({
          userId: session.user.id,
          totalAmount: totalAmount,
          status: OrderStatus.Pending,
        })
        .returning();

      // Create Order Items
      if (orderItemsData.length > 0) {
        await tx.insert(orderItems).values(
          orderItemsData.map((item) => ({
            orderId: newOrder.id,
            ...item,
          }))
        );
      }
      
      return newOrder;
    });

    return NextResponse.json({ success: true, order: result }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      with: {
        items: {
          with: {
            product: true,
            pricingType: true,
          },
        },
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
