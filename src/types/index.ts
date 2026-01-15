import { products, brands, pricingTypes, productBrands, productPrices } from "@/db/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type Brand = InferSelectModel<typeof brands>;
export type NewBrand = InferInsertModel<typeof brands>;

export type PricingType = InferSelectModel<typeof pricingTypes>;
export type NewPricingType = InferInsertModel<typeof pricingTypes>;

export type ProductBrand = InferSelectModel<typeof productBrands>;
export type NewProductBrand = InferInsertModel<typeof productBrands>;

export type ProductPrice = InferSelectModel<typeof productPrices>;
export type NewProductPrice = InferInsertModel<typeof productPrices>;
