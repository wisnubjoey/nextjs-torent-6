'use server';

import { db } from '@/index';
import { orderItems, orders, products, OrderStatus } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and, or, between, inArray } from 'drizzle-orm';
import { addHours } from 'date-fns';

export type ReminderType = 'start' | 'end';

export interface Reminder {
  id: string; // orderItemId
  productName: string;
  type: ReminderType;
  date: Date;
  hoursRemaining: number;
  orderId: string;
  status: OrderStatus;
  userName?: string;
  userEmail?: string;
}

export async function getReminders() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return { reminders: [], count: 0 };
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  const now = new Date();
  const next24Hours = addHours(now, 24);

  // Logic:
  // 1. Rental starting soon (Confirmed orders, startDate within 24h)
  // 2. Rental ending soon (Active orders, endDate within 24h)
  
  // We can just fetch items within the time window and filter by status in JS or DB.
  // Using DB filter is better.

  const timeConditions = or(
    between(orderItems.startDate, now, next24Hours),
    between(orderItems.endDate, now, next24Hours)
  );
  
  const statusConditions = inArray(orders.status, [OrderStatus.Confirmed, OrderStatus.Active]);

  const whereClause = userRole === 'admin' 
    ? and(timeConditions, statusConditions)
    : and(timeConditions, statusConditions, eq(orders.userId, userId));

  // We need to join with 'user' table to get user details if admin
  // But 'user' table is imported from auth-schema
  const { user } = await import('@/db/schema');

  const query = db
    .select({
      id: orderItems.id,
      productName: products.modelName,
      startDate: orderItems.startDate,
      endDate: orderItems.endDate,
      orderId: orders.id,
      status: orders.status,
      userName: user.name,
      userEmail: user.email,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(user, eq(orders.userId, user.id))
    .where(whereClause);

  const results = await query;

  const reminders: Reminder[] = [];

  for (const item of results) {
    // Check start date (only for Confirmed orders)
    if (item.status === OrderStatus.Confirmed && item.startDate > now && item.startDate <= next24Hours) {
      const hours = (item.startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      reminders.push({
        id: item.id,
        productName: item.productName,
        type: 'start',
        date: item.startDate,
        hoursRemaining: Math.round(hours * 10) / 10,
        orderId: item.orderId,
        status: item.status as OrderStatus,
        userName: item.userName,
        userEmail: item.userEmail,
      });
    }

    // Check end date (only for Active orders)
    if (item.status === OrderStatus.Active && item.endDate > now && item.endDate <= next24Hours) {
       const hours = (item.endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      reminders.push({
        id: item.id,
        productName: item.productName,
        type: 'end',
        date: item.endDate,
        hoursRemaining: Math.round(hours * 10) / 10,
        orderId: item.orderId,
        status: item.status as OrderStatus,
        userName: item.userName,
        userEmail: item.userEmail,
      });
    }
  }
  
  reminders.sort((a, b) => a.hoursRemaining - b.hoursRemaining);

  return {
    reminders,
    count: reminders.length
  };
}
