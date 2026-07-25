import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  )
}
