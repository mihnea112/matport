import { NextResponse } from "next/server";
import { adminSupabase } from "../_admin";

export async function GET(req: Request) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  let query = supabase
    .from("listings")
    .select("id,title,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ listings: data ?? [] });
}

export async function DELETE(req: Request) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}