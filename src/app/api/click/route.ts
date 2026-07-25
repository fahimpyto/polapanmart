import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const { product_id } = await request.json()

    if (!product_id) {
      return Response.json({ error: "product_id is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    await supabase.rpc("increment_click", { product_id })

    await supabase.from("clicks").insert({
      product_id,
      user_agent: request.headers.get("user-agent") ?? null,
      referrer: request.headers.get("referer") ?? null,
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
