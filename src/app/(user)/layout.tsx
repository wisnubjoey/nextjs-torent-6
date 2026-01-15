import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import UserSidebar from '@/components/user-sidebar'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <UserSidebar>
      {children}
    </UserSidebar>
  )
}