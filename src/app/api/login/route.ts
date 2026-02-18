import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabaseFromToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: { persistSession: false },
    },
  );
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization token" },
      { status: 401 },
    );
  }

  const supabase = supabaseFromToken(token);

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();
  if (uErr || !user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: profile, error: pErr }, { data: company, error: cErr }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, first_name, last_name, phone, role, account_kind, company_id")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("companies")
        .select("id, legal_name, display_name, cui, city, county, is_verified")
        .eq("owner_user_id", user.id)
        .maybeSingle(),
    ]);

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });

  const role = (profile as any)?.role ?? "user";

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email },
    role, // 'user' | 'admin'
    accountType: company ? "seller" : "buyer",
    profile: profile ?? null,
    company: company ?? null,
  });
}
