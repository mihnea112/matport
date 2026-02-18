import { NextResponse } from "next/server";
import { adminSupabase } from "../_admin";

export async function GET(req: Request) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Works even if some optional columns don't exist (but adjust select if needed)
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(req: Request) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug })
    .select("id,name,slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, category: data });
}

export async function PATCH(req: Request) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const id = String(body.id ?? "").trim();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const patch: any = {};
  if (typeof body.name === "string") patch.name = String(body.name).trim();
  if (typeof body.slug === "string") patch.slug = String(body.slug).trim();

  if (!patch.name && !patch.slug) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", id)
    .select("id,name,slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, category: data });
}

export async function DELETE(req: Request) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}