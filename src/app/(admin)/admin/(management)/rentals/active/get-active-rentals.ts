import { db } from "@/index"
import { orders, OrderStatus } from "@/db/schema"
import { eq } from "drizzle-orm"
import { updateExpiredOrders } from "@/lib/orders"

export async function getActiveRentals() {
  await updateExpiredOrders();

  const activeRentals = await db.query.orders.findMany({
    where: eq(orders.status, OrderStatus.Active),
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
