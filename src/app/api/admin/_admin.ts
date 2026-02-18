import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

function supabaseFromBearer(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    }
  );
}

export async function adminSupabase(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const supabase = bearer ? supabaseFromBearer(bearer) : await supabaseServer();

  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr || !user) return { supabase, user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: profile?.role === "admin" };
}