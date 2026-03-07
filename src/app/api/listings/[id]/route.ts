import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Ctx = { params: Promise<{ id: string }> };

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

async function getRole(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .limit(1);

  if (error) return { role: null as string | null, error: error.message };
  const first = Array.isArray(data) ? data[0] : null;
  return { role: (first as any)?.role ?? null, error: null as string | null };
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!bearer)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = supabaseFromBearer(bearer);

  const { data: uData, error: uErr } = await supabase.auth.getUser();
  const user = uData?.user ?? null;
  if (uErr || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, error: roleErr } = await getRole(supabase, user.id);
  if (roleErr) return NextResponse.json({ error: roleErr }, { status: 400 });
  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}) as any);
  const status = String(body.status ?? "").trim();
  if (status !== "active" && status !== "draft") {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const { data: rows, error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", id)
    .select("id,status")
    .limit(1);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const updated = Array.isArray(rows) ? rows[0] : null;
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ listing: updated }, { status: 200 });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!bearer)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = supabaseFromBearer(bearer);

  const { data: uData, error: uErr } = await supabase.auth.getUser();
  const user = uData?.user ?? null;
  if (uErr || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, error: roleErr } = await getRole(supabase, user.id);
  if (roleErr) return NextResponse.json({ error: roleErr }, { status: 400 });
  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error: delImgsErr } = await supabase
    .from("listing_images")
    .delete()
    .eq("listing_id", id);
  if (delImgsErr)
    return NextResponse.json({ error: delImgsErr.message }, { status: 400 });

  const { error: delErr } = await supabase
    .from("listings")
    .delete()
    .eq("id", id);
  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 400 });

  return NextResponse.json({ ok: true }, { status: 200 });
}
