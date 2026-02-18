import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(id,storage_path,sort_order)")
    .eq("id", params.id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ listing: data });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // RLS should ensure only the seller-company owner can update
  const { data, error } = await supabase
    .from("listings")
    .update({
      title: body.title,
      description: body.description,
      quantity: body.quantity,
      unit: body.unit,
      price_total: body.price_total,
      status: body.status,
      pickup_city: body.pickup_city,
      pickup_county: body.pickup_county,
      category_id: body.category_id,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ listing: data });
}
