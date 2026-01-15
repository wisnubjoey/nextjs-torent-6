import { db } from "@/index"
import { user } from "@/db/schema"

export async function getUsers() {
  const users = await db.select().from(user).orderBy(user.createdAt)
  return users
}
