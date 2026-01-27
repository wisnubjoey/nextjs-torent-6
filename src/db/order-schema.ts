import { relations } from "drizzle-orm";
import { pgTable, text, uuid, timestamp, doublePrecision, integer, pgEnum, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { products, pricingTypes } from "./product-schema";

export enum OrderStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
}

export const orderStatusEnum = pgEnum("order_status", [
  OrderStatus.Pending,
  OrderStatus.Confirmed,
  OrderStatus.Active,
  OrderStatus.Cancelled,
  OrderStatus.Completed,
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull().default(OrderStatus.Pending),
  totalAmount: doublePrecision("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  pricingTypeId: uuid("pricing_type_id")
    .notNull()
    .references(() => pricingTypes.id),
  quantity: integer("quantity").notNull().default(1),
  priceSnapshot: doublePrecision("price_snapshot").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
}, (t) => [
  index("idx_order_items_product_dates").on(t.productId, t.startDate, t.endDate),
]);

// --- Relations ---

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  pricingType: one(pricingTypes, {
    fields: [orderItems.pricingTypeId],
    references: [pricingTypes.id],
  }),
}));
