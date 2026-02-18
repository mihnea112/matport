import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = supabaseAdmin();
  const payload = await req.json();

  // TODO: verify provider signature (Netopia/Stripe specific). Do not skip in production.

  const provider = payload.provider; // "netopia" | "stripe"
  const providerPaymentId = payload.provider_payment_id;
  const status = payload.status; // "captured" | "failed"

  if (!provider || !providerPaymentId || !status) {
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 },
    );
  }

  const { data: payment, error: pErr } = await supabase
    .from("payments")
    .select("id,order_id")
    .eq("provider", provider)
    .eq("provider_payment_id", providerPaymentId)
    .single();

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

  const newPaymentStatus = status === "captured" ? "captured" : "failed";

  await supabase
    .from("payments")
    .update({ status: newPaymentStatus })
    .eq("id", payment.id);

  if (newPaymentStatus === "captured") {
    await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", payment.order_id);

    const { data: items } = await supabase
      .from("order_items")
      .select("listing_id")
      .eq("order_id", payment.order_id);

    const listingIds = (items ?? []).map((i) => i.listing_id);
    if (listingIds.length) {
      await supabase
        .from("listings")
        .update({ status: "sold" })
        .in("id", listingIds);
    }
  }

  return NextResponse.json({ ok: true });
}
