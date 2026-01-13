import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminSidebar from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Double-check: ensure user is admin for all admin pages
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}