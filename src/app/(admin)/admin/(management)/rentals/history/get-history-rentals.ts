import { db } from "@/index"
import { orders, OrderStatus } from "@/db/schema"
import { inArray } from "drizzle-orm"

export async function getHistoryRentals() {
  const historyRentals = await db.query.orders.findMany({
    where: inArray(orders.status, [OrderStatus.Completed, OrderStatus.Cancelled]),
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
  return historyRentals
}
