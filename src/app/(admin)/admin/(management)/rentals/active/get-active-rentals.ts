import { db } from "@/index"
import { orders, OrderStatus } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getActiveRentals() {
  const activeRentals = await db.query.orders.findMany({
    where: eq(orders.status, OrderStatus.Confirmed),
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
  return activeRentals
}
