import { db } from "@/index"
import { orders, OrderStatus } from "@/db/schema"
import { inArray } from "drizzle-orm"

export async function getPendingRentals() {
  const rentals = await db.query.orders.findMany({
    where: inArray(orders.status, [OrderStatus.Pending, OrderStatus.Confirmed]),
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
  return rentals
}
