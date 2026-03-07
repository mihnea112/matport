import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

function supabaseFromBearer(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    },
  );
}

// Optional: public feed (active only) for testing
export async function GET(req: NextRequest) {
  const supabase = await supabaseServer();

  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = Math.max(1, Math.min(50, Number(limitParam ?? 12) || 12));

  const { data, error } = await supabase
    .from("listings")
    .select("id,title,status,created_at,price_total,currency,pickup_city,pickup_county")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ listings: data ?? [] }, { status: 200 });
}

// Create listing (always draft). Requires authenticated seller.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  console.log("[api/listings] POST", {
    hasAuthHeader: Boolean(authHeader),
    hasBearer: Boolean(bearer),
  });

  const supabase = bearer ? supabaseFromBearer(bearer) : await supabaseServer();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  console.log("[api/listings] getUser", {
    userId: user?.id ?? null,
    email: user?.email ?? null,
    uErr: uErr?.message ?? null,
  });

  if (uErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as any));

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim() || null;

  const quantity = Number(body.quantity);
  const unit = String(body.unit ?? "").trim();
  const price_total = Number(body.price_total);

  const category_id =
    body.category_id === null ||
    body.category_id === undefined ||
    body.category_id === ""
      ? null
      : Number(body.category_id);

  const pickup_city = String(body.pickup_city ?? "").trim() || null;
  const pickup_county = String(body.pickup_county ?? "").trim() || null;

  if (!title)
    return NextResponse.json({ error: "title required" }, { status: 400 });
  if (!Number.isFinite(quantity) || quantity <= 0)
    return NextResponse.json({ error: "quantity invalid" }, { status: 400 });
  if (!unit)
    return NextResponse.json({ error: "unit required" }, { status: 400 });
  if (!Number.isFinite(price_total) || price_total < 0)
    return NextResponse.json({ error: "price_total invalid" }, { status: 400 });

  if (category_id !== null && !Number.isFinite(category_id)) {
    return NextResponse.json({ error: "category_id invalid" }, { status: 400 });
  }

  // Find seller company for this user
  const { data: companyRows, error: cErr } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_user_id", user.id)
    .limit(1);

  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });
  const company = Array.isArray(companyRows) ? companyRows[0] : null;

  if (!company?.id) {
    return NextResponse.json(
      {
        error:
          "No company found for this user. Register as Persoană juridică first.",
      },
      { status: 400 },
    );
  }

  const status = "draft";
  const currency =
    String(body.currency ?? "RON").trim().toUpperCase().slice(0, 3) || "RON";

  const { data: rows, error } = await supabase
    .from("listings")
    .insert({
      seller_company_id: company.id,
      status,
      category_id,
      title,
      description,
      quantity,
      unit,
      price_total,
      currency,
      pickup_city,
      pickup_county,
    })
    .select("*")
    .limit(1);

  if (error) {
    console.error("[api/listings] insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const listing = Array.isArray(rows) ? rows[0] : null;
  if (!listing) return NextResponse.json({ error: "Insert failed" }, { status: 400 });

  return NextResponse.json({ listing }, { status: 201 });
}
