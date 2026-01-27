import { db } from "@/index"
import { orders, OrderStatus } from "@/db/schema"
import { inArray } from "drizzle-orm"
import { updateExpiredOrders } from "@/lib/orders"

export async function getHistoryRentals() {
  await updateExpiredOrders()
  
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
