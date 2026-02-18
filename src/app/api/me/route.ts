import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user)
    return NextResponse.json({ user: null }, { status: 401 });

  const { data: company } = await supabase
    .from("companies")
    .select("id, legal_name, display_name, cui, city, county, is_verified")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ user, company });
}
