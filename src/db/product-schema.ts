import { relations } from "drizzle-orm";
import { pgTable, text, uuid, primaryKey, doublePrecision, timestamp } from "drizzle-orm/pg-core";

// --- Base Tables ---

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  logo: text("logo"), // URL to the logo image
});

export const pricingTypes = pgTable("pricing_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // 'Daily', 'Weekly', 'Monthly'
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelName: text("model_name").notNull(),
  image: text("image"), // URL to product image
  deletedAt: timestamp("deleted_at"),
});

// --- Junction Tables ---

export const productBrands = pgTable(
  "product_brands",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.brandId] }),
  ]
);

export const productPrices = pgTable(
  "product_prices",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    pricingTypeId: uuid("pricing_type_id")
      .notNull()
      .references(() => pricingTypes.id, { onDelete: "cascade" }),
    price: doublePrecision("price").notNull(), // Assuming simple decimal storage for now
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.pricingTypeId] }),
  ]
);

// --- Relations ---

export const brandsRelations = relations(brands, ({ many }) => ({
  productBrands: many(productBrands),
}));

export const pricingTypesRelations = relations(pricingTypes, ({ many }) => ({
  productPrices: many(productPrices),
}));

export const productsRelations = relations(products, ({ many }) => ({
  productBrands: many(productBrands),
  productPrices: many(productPrices),
}));

export const productBrandsRelations = relations(productBrands, ({ one }) => ({
  product: one(products, {
    fields: [productBrands.productId],
    references: [products.id],
  }),
  brand: one(brands, {
    fields: [productBrands.brandId],
    references: [brands.id],
  }),
}));

export const productPricesRelations = relations(productPrices, ({ one }) => ({
  product: one(products, {
    fields: [productPrices.productId],
    references: [products.id],
  }),
  pricingType: one(pricingTypes, {
    fields: [productPrices.pricingTypeId],
    references: [pricingTypes.id],
  }),
}));
