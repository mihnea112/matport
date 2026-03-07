import { NextRequest, NextResponse } from "next/server";
import { adminSupabase } from "../_admin";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  // Public read: used by homepage and listing form.
  // RLS should allow SELECT for public/authenticated as desired.
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,image_path")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const image_path =
    body.image_path === null || body.image_path === undefined
      ? null
      : String(body.image_path).trim() || null;

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug, image_path })
    .select("id,name,slug,image_path")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, category: data });
}

export async function PATCH(req: NextRequest) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const id = String(body.id ?? "").trim();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const patch: any = {};
  if (typeof body.name === "string") patch.name = String(body.name).trim();
  if (typeof body.slug === "string") patch.slug = String(body.slug).trim();
  if (body.image_path === null) patch.image_path = null;
  if (typeof body.image_path === "string") {
    patch.image_path = String(body.image_path).trim() || null;
  }

  if (
    patch.name === undefined &&
    patch.slug === undefined &&
    patch.image_path === undefined
  ) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", id)
    .select("id,name,slug,image_path")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, category: data });
}

export async function DELETE(req: NextRequest) {
  const { supabase, isAdmin } = await adminSupabase(req);
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}