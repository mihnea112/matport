// File: src/app/api/admin/companies/[id]/route.ts
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

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!bearer) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const supabase = supabaseFromBearer(bearer);

  const { data: uData, error: uErr } = await supabase.auth.getUser();
  const user = uData?.user ?? null;

  if (uErr || !user) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: roleRows, error: rErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .limit(1);

  if (rErr) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: rErr.message }, { status: 400 }),
    };
  }

  const first = Array.isArray(roleRows) ? roleRows[0] : null;
  const role = (first as any)?.role ?? null;

  if (role !== "admin") {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true as const, supabase };
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => ({}) as any);
  const is_verified = Boolean(body?.is_verified);

  const { data: rows, error } = await auth.supabase
    .from("companies")
    .update({ is_verified })
    .eq("id", id)
    .select("id,is_verified")
    .limit(1);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const updated = Array.isArray(rows) ? rows[0] : null;
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ company: updated }, { status: 200 });
}
