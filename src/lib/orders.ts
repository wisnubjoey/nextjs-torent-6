import { db } from "@/index";
import { orders, orderItems, OrderStatus } from "@/db/schema";
import { eq, and, sql, notExists, gte } from "drizzle-orm";

/**
 * Updates orders with 'active' status to 'completed' if all their items have expired.
 */
export async function updateExpiredOrders() {
  const now = new Date();

  // Update orders set status = 'completed'
  // WHERE status = 'active'
  // AND NOT EXISTS (SELECT 1 FROM order_items WHERE order_id = orders.id AND end_date >= now)
  
  await db.update(orders)
    .set({ status: OrderStatus.Completed })
    .where(
      and(
        eq(orders.status, OrderStatus.Active),
        notExists(
          db.select()
            .from(orderItems)
            .where(
              and(
                eq(orderItems.orderId, orders.id),
                gte(orderItems.endDate, now)
              )
            )
        )
      )
    );
}
