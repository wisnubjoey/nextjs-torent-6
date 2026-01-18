'use server'

import { db } from "@/index"
import { orders, OrderStatus, orderItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function acceptOrder(orderId: string) {
  try {
    await db.update(orders)
      .set({ status: OrderStatus.Confirmed })
      .where(eq(orders.id, orderId))
    
    revalidatePath('/admin/rentals/pending')
    return { success: true }
  } catch (error) {
    console.error('Failed to accept order:', error)
    return { success: false, error: 'Failed to accept order' }
  }
}

export async function activateOrder(orderId: string) {
  try {
    await db.transaction(async (tx) => {
      // 1. Update Order Status to Active
      await tx.update(orders)
        .set({ status: OrderStatus.Active })
        .where(eq(orders.id, orderId))

      // 2. Update Start Date of Order Items to Now
      const now = new Date()
      await tx.update(orderItems)
        .set({ startDate: now })
        .where(eq(orderItems.orderId, orderId))
    })

    revalidatePath('/admin/rentals/pending')
    revalidatePath('/admin/rentals/active')
    revalidatePath('/dashboard/my-rentals') // Revalidate user dashboard
    return { success: true }
  } catch (error) {
    console.error('Failed to activate order:', error)
    return { success: false, error: 'Failed to activate order' }
  }
}

export async function cancelOrder(orderId: string) {
  try {
    await db.update(orders)
      .set({ status: OrderStatus.Cancelled })
      .where(eq(orders.id, orderId))
    
    revalidatePath('/admin/rentals/pending')
    return { success: true }
  } catch (error) {
    console.error('Failed to cancel order:', error)
    return { success: false, error: 'Failed to cancel order' }
  }
}
