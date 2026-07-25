import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Package, TrendingUp, Star } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { count: featuredProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("featured", true)

  const { data: clickData } = await supabase
    .from("products")
    .select("click_count")
    .order("click_count", { ascending: false })

  const totalClicks = clickData?.reduce((sum, p) => sum + (p.click_count ?? 0), 0) ?? 0

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-zinc-500">
                Total Products
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProducts ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-zinc-500">
                Featured
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{featuredProducts ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-zinc-500">
                Total Clicks
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClicks}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
