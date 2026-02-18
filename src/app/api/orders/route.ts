import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Item = { listing_id: string; quantity: number };

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const items: Item[] = body.items ?? [];
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }

  // Buyer context: if user has a company => B2B, else => B2C
  const { data: buyerCompany } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  const listingIds = items.map((i) => i.listing_id);
  const { data: listings, error: lErr } = await supabase
    .from("listings")
    .select("id,status,price_total,quantity,seller_company_id,currency")
    .in("id", listingIds);

  if (lErr) return NextResponse.json({ error: lErr.message }, { status: 400 });
  if (!listings || listings.length !== listingIds.length) {
    return NextResponse.json(
      { error: "Some listings not found" },
      { status: 400 },
    );
  }

  // MVP: require full-lot purchases
  for (const it of items) {
    const l = listings.find((x) => x.id === it.listing_id)!;
    if (l.status !== "active")
      return NextResponse.json(
        { error: "Listing not active" },
        { status: 409 },
      );
    if (Number(it.quantity) !== Number(l.quantity)) {
      return NextResponse.json(
        { error: "MVP requires full-lot purchase" },
        { status: 400 },
      );
    }
  }

  // MVP: all listings must have same currency
  const currency = listings[0].currency ?? "RON";
  if (listings.some((l) => (l.currency ?? "RON") !== currency)) {
    return NextResponse.json(
      { error: "Mixed currencies not supported" },
      { status: 400 },
    );
  }

  const total = listings.reduce((sum, l) => sum + Number(l.price_total), 0);

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      buyer_company_id: buyerCompany?.id ?? null,
      buyer_user_id: buyerCompany?.id ? null : user.id,
      status: "pending_payment",
      currency,
      total_amount: total,
      billing_name: body.billing_name ?? null,
      billing_cui: body.billing_cui ?? null,
      billing_address_text: body.billing_address_text ?? null,
      delivery_address_text: body.delivery_address_text ?? null,
      delivery_city: body.delivery_city ?? null,
      delivery_county: body.delivery_county ?? null,
    })
    .select("*")
    .single();

  if (oErr) return NextResponse.json({ error: oErr.message }, { status: 400 });

  const orderItemsPayload = listings.map((l) => ({
    order_id: order.id,
    listing_id: l.id,
    seller_company_id: l.seller_company_id,
    quantity: l.quantity,
    line_total: l.price_total,
  }));

  const { error: oiErr } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);
  if (oiErr)
    return NextResponse.json({ error: oiErr.message }, { status: 400 });

  return NextResponse.json({ order_id: order.id }, { status: 201 });
}
