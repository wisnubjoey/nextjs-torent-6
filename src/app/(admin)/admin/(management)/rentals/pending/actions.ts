'use server'

import { db } from "@/index"
import { orders, OrderStatus } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function acceptOrder(orderId: string) {
  try {
    await db.update(orders)
      .set({ status: OrderStatus.Active })
      .where(eq(orders.id, orderId))
    
    revalidatePath('/admin/rentals/pending')
    revalidatePath('/admin/rentals/active')
    return { success: true }
  } catch (error) {
    console.error('Failed to accept order:', error)
    return { success: false, error: 'Failed to accept order' }
  }
}
