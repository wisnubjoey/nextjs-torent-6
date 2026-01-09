import { db } from "@/index";
import { user } from "./auth-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // --- Seed Regular User ---
    const userEmail = "user@example.com";
    const userPassword = "user123";

    const existingUser = await db.select().from(user).where(eq(user.email, userEmail)).limit(1);
    
    if (existingUser.length === 0) {
      await auth.api.signUpEmail({
        body: {
          email: userEmail,
          password: userPassword,
          name: "Regular User",
        }
      });
      console.log(`✅ Regular user created: ${userEmail}`);
    } else {
      console.log("ℹ️ Regular user already exists");
    }

    // --- Seed Admin User ---
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";

    const existingAdmin = await db.select().from(user).where(eq(user.email, adminEmail)).limit(1);
    
    if (existingAdmin.length === 0) {
      // 1. Create the user using better-auth API to ensure correct hashing
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: "Admin User",
        }
      });
      
      // 2. Update the role to 'admin' manually in the database
      await db.update(user)
        .set({ role: "admin", emailVerified: true })
        .where(eq(user.email, adminEmail));
        
      console.log(`✅ Admin user created and promoted: ${adminEmail}`);
      console.log(`🔑 Admin password: ${adminPassword}`);
    } else {
      // Ensure existing admin has the correct role
      await db.update(user)
        .set({ role: "admin" })
        .where(eq(user.email, adminEmail));
      console.log("ℹ️ Admin user already exists (role verified)");
    }

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

// Run the seed function
seed().then(() => {
  console.log("🏁 Seeding finished");
  process.exit(0);
});
