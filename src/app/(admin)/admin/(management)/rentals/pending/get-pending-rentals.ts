import { db } from "@/index"
import { orders, OrderStatus } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getPendingRentals() {
  const pendingRentals = await db.query.orders.findMany({
    where: eq(orders.status, OrderStatus.Pending),
    with: {
      user: true,
      items: {
        with: {
          product: true,
          pricingType: true
        }
      }
    },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)]
  })
  return pendingRentals
}
