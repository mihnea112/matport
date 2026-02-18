import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await supabaseServer();
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.trim();
  const city = searchParams.get("city")?.trim();
  const categoryId = searchParams.get("category_id");

  let query = supabase
    .from("listings")
    .select(
      "id,status,title,description,quantity,unit,price_total,currency,pickup_city,pickup_county,category_id,created_at",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (city) query = query.ilike("pickup_city", city);
  if (categoryId) query = query.eq("category_id", Number(categoryId));
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ listings: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data: company, error: cErr } = await supabase
    .from("companies")
    .select("id,is_verified")
    .eq("owner_user_id", user.id)
    .single();

  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });

  const status = body.status ?? "draft";
  if (status === "active" && !company.is_verified) {
    return NextResponse.json(
      { error: "Company not verified" },
      { status: 403 },
    );
  }

  const payload = {
    seller_company_id: company.id,
    status,
    category_id: body.category_id ?? null,
    title: String(body.title ?? "").trim(),
    description: body.description ?? null,
    quantity: Number(body.quantity),
    unit: String(body.unit ?? "").trim(),
    price_total: Number(body.price_total),
    currency: body.currency ?? "RON",
    pickup_city: body.pickup_city ?? null,
    pickup_county: body.pickup_county ?? null,
  };

  if (!payload.title)
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  if (!Number.isFinite(payload.quantity) || payload.quantity <= 0)
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  if (!Number.isFinite(payload.price_total) || payload.price_total <= 0)
    return NextResponse.json({ error: "Invalid price_total" }, { status: 400 });
  if (!payload.unit)
    return NextResponse.json({ error: "Unit required" }, { status: 400 });

  const { data, error } = await supabase
    .from("listings")
    .insert(payload)
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ listing: data }, { status: 201 });
}
