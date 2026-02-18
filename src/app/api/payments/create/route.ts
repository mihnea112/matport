import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_id, provider } = await req.json();
  if (!order_id || !provider)
    return NextResponse.json(
      { error: "order_id and provider required" },
      { status: 400 },
    );

  // RLS should ensure the buyer can read this order
  const { data: order, error: oErr } = await supabase
    .from("orders")
    .select("id,total_amount,currency,status")
    .eq("id", order_id)
    .single();

  if (oErr) return NextResponse.json({ error: oErr.message }, { status: 400 });
  if (order.status !== "pending_payment")
    return NextResponse.json({ error: "Order not payable" }, { status: 409 });

  const { data: payment, error: pErr } = await supabase
    .from("payments")
    .insert({
      order_id,
      provider,
      status: "initiated",
      amount: order.total_amount,
      currency: order.currency,
      provider_payment_id: null,
    })
    .select("*")
    .single();

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

  // You now redirect/init provider payment using payment.id as internal ref.
  return NextResponse.json({ payment_id: payment.id });
}
