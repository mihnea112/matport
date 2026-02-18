import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { note, evidence_path_1, evidence_path_2 } = await req.json();

  const { data: company, error: cErr } = await supabase
    .from("companies")
    .select("id,is_verified")
    .eq("owner_user_id", user.id)
    .single();

  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });
  if (company.is_verified)
    return NextResponse.json({ error: "Already verified" }, { status: 409 });

  const { data, error } = await supabase
    .from("verification_requests")
    .insert({
      company_id: company.id,
      submitted_by: user.id,
      note: note ?? null,
      evidence_path_1: evidence_path_1 ?? null,
      evidence_path_2: evidence_path_2 ?? null,
    })
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ request: data }, { status: 201 });
}
