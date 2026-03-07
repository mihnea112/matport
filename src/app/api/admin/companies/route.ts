// File: src/app/api/admin/companies/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.res;

  const search = (req.nextUrl.searchParams.get("search") ?? "").trim();

  let q = auth.supabase
    .from("companies")
    .select(
      "id,owner_user_id,legal_name,display_name,cui,city,county,is_verified,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (search) {
    // Search on legal_name/display_name/cui
    const s = search.replaceAll("%", "\\%").replaceAll("_", "\\_");
    q = q.or(
      `legal_name.ilike.%${s}%,display_name.ilike.%${s}%,cui.ilike.%${s}%`,
    );
  }

  const { data, error } = await q;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ companies: data ?? [] }, { status: 200 });
}
