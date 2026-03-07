import { NextRequest, NextResponse } from "next/server";
import { adminSupabase } from "../_admin";

async function getRole(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return { role: null as string | null, error: error.message };
  return { role: (data as any)?.role ?? null, error: null as string | null };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const hasBearer = authHeader.startsWith("Bearer ");

  const { supabase, user, isAdmin } = await adminSupabase(req);
  const userId = user?.id ?? null;

  const { role, error: roleErr } = userId
    ? await getRole(supabase, userId)
    : { role: null as string | null, error: null as string | null };

  if (!isAdmin) {
    return NextResponse.json(
      {
        error: "Forbidden",
        debug: {
          userId,
          role,
          hasBearer,
          roleErr,
        },
      },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || searchParams.get("search") || "").trim();

  let query = supabase
    .from("listings")
    .select("id,title,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ listings: data ?? [] });
}

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const hasBearer = authHeader.startsWith("Bearer ");

  const { supabase, user, isAdmin } = await adminSupabase(req);
  const userId = user?.id ?? null;

  const { role, error: roleErr } = userId
    ? await getRole(supabase, userId)
    : { role: null as string | null, error: null as string | null };

  if (!isAdmin) {
    return NextResponse.json(
      {
        error: "Forbidden",
        debug: {
          userId,
          role,
          hasBearer,
          roleErr,
        },
      },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}