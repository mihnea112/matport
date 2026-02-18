import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as any));
  const storage_path = body?.storage_path;
  const sort_order = body?.sort_order ?? 0;

  if (!storage_path) {
    return NextResponse.json({ error: "storage_path required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("listing_images")
    .insert({ listing_id: id, storage_path, sort_order })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ image: data }, { status: 201 });
}