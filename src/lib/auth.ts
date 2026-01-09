import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/index"; // your drizzle instance
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin({
            // adminUserIds: ["your-user-id-here"]
        })
    ]
});