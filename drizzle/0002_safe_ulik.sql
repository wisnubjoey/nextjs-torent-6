CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo" text
);
--> statement-breakpoint
CREATE TABLE "pricing_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "pricing_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_brands" (
	"product_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	CONSTRAINT "product_brands_product_id_brand_id_pk" PRIMARY KEY("product_id","brand_id")
);
--> statement-breakpoint
CREATE TABLE "product_prices" (
	"product_id" uuid NOT NULL,
	"pricing_type_id" uuid NOT NULL,
	"price" double precision NOT NULL,
	CONSTRAINT "product_prices_product_id_pricing_type_id_pk" PRIMARY KEY("product_id","pricing_type_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_name" text NOT NULL,
	"image" text
);
--> statement-breakpoint
ALTER TABLE "product_brands" ADD CONSTRAINT "product_brands_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_brands" ADD CONSTRAINT "product_brands_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_pricing_type_id_pricing_types_id_fk" FOREIGN KEY ("pricing_type_id") REFERENCES "public"."pricing_types"("id") ON DELETE cascade ON UPDATE no action;