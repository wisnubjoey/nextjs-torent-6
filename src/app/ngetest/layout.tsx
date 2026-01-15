import UserSidebar from "@/components/user-sidebar"

export default function NgetestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserSidebar>
      {children}
    </UserSidebar>
  )
}