import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type AccountType = "buyer" | "seller";

type CompanyInput = {
  legal_name: string;
  display_name?: string | null;
  cui: string;
  county?: string | null;
  city?: string | null;
};

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

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const supabase = bearer ? supabaseFromBearer(bearer) : await supabaseServer();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[api/register] user", { id: user.id, email: user.email });

  const body = await req.json();

  console.log("[api/register] payload", {
    accountType: body?.accountType,
    accountKind: body?.accountKind,
    firstName: body?.firstName,
    lastName: body?.lastName,
    hasCompany: Boolean(body?.company),
    companyKeys: body?.company ? Object.keys(body.company) : [],
  });

  const accountType: AccountType = body.accountType;
  const accountKind: "individual" | "company" =
    body.accountKind === "company" ? "company" : "individual";

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const phone = String(body.phone ?? "").trim() || null;

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "firstName and lastName required" },
      { status: 400 }
    );
  }

  if (accountType !== "buyer" && accountType !== "seller") {
    return NextResponse.json(
      { error: "accountType must be buyer|seller" },
      { status: 400 }
    );
  }

  // 1) Upsert profile (deterministic onConflict) and verify it exists
  const profilePayload = {
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    phone,
    account_kind: accountKind,
  };

  const { data: upsertedProfile, error: pErr } = await supabase
    .from("profiles")
    .upsert(profilePayload, { onConflict: "user_id" })
    .select("user_id")
    .single();

  if (pErr) {
    console.error("[api/register] profiles.upsert failed", pErr);
    return NextResponse.json(
      { error: pErr.message, where: "profiles.upsert" },
      { status: 400 }
    );
  }

  console.log("[api/register] profile upsert ok", upsertedProfile);

  // Fallback safety: if no row returned (rare), check and insert
  if (!upsertedProfile?.user_id) {
    const { data: existingProfile, error: pSelErr } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (pSelErr) {
      console.error("[api/register] profiles.select failed", pSelErr);
      return NextResponse.json(
        { error: pSelErr.message, where: "profiles.select" },
        { status: 400 }
      );
    }

    if (!existingProfile) {
      const { data: insertedProfile, error: pInsErr } = await supabase
        .from("profiles")
        .insert(profilePayload)
        .select("user_id")
        .single();

      if (pInsErr) {
        console.error("[api/register] profiles.insert failed", pInsErr);
        return NextResponse.json(
          { error: pInsErr.message, where: "profiles.insert" },
          { status: 400 }
        );
      }

      console.log("[api/register] profile insert fallback ok", insertedProfile);
    }
  }

  // 2) Company flow
  if (accountType === "seller") {
    const companyIn: CompanyInput | null = body.company ?? null;
    if (!companyIn) {
      return NextResponse.json(
        { error: "company payload required for seller" },
        { status: 400 }
      );
    }

    // Normalize + validate required fields (DB has NOT NULL on many)
    const legal_name = String(companyIn.legal_name ?? "").trim();
    const display_name =
      String(companyIn.display_name ?? "").trim() || legal_name;
    const cui = String(companyIn.cui ?? "").trim();

    const county = String(companyIn.county ?? "").trim() || null;
    const city = String(companyIn.city ?? "").trim() || null;

    if (!legal_name || !cui) {
      return NextResponse.json(
        { error: "Missing required company fields (need: legal_name, cui)" },
        { status: 400 }
      );
    }

    // Enforce 1 company per user: update if exists, else insert
    const { data: existingCompany, error: cReadErr } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_user_id", user.id)
      .maybeSingle();

    if (cReadErr) {
      console.error("[api/register] companies.select failed", cReadErr);
      return NextResponse.json(
        { error: cReadErr.message, where: "companies.select" },
        { status: 400 }
      );
    }

    const mutation = {
      owner_user_id: user.id,
      legal_name,
      display_name,
      cui,
      county,
      city,
      is_verified: false,
    };

    const { data: company, error: cErr } = existingCompany
      ? await supabase
          .from("companies")
          .update(mutation)
          .eq("owner_user_id", user.id)
          .select(
            "id, legal_name, display_name, cui, city, county, is_verified"
          )
          .single()
      : await supabase
          .from("companies")
          .insert(mutation)
          .select(
            "id, legal_name, display_name, cui, city, county, is_verified"
          )
          .single();

    if (cErr) {
      console.error(
        `[api/register] ${existingCompany ? "companies.update" : "companies.insert"} failed`,
        cErr
      );
      return NextResponse.json(
        {
          error: cErr.message,
          where: existingCompany ? "companies.update" : "companies.insert",
        },
        { status: 400 }
      );
    }

    console.log("[api/register] company upsert ok", { companyId: company.id });

    // Link profile -> company
    const { error: linkErr } = await supabase
      .from("profiles")
      .update({ company_id: company.id, account_kind: "company" })
      .eq("user_id", user.id);

    if (linkErr) {
      console.error("[api/register] profiles.update(company_id) failed", linkErr);
      return NextResponse.json(
        { error: linkErr.message, where: "profiles.update(company_id)" },
        { status: 400 }
      );
    }

    console.log("[api/register] profile linked to company", { userId: user.id, companyId: company.id });

    return NextResponse.json({ ok: true, company });
  }

  // 3) Buyer/individual flow: ensure no company link
  const { error: indErr } = await supabase
    .from("profiles")
    .update({ account_kind: "individual", company_id: null })
    .eq("user_id", user.id);

  if (indErr) {
    return NextResponse.json(
      { error: indErr.message, where: "profiles.update(individual)" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, company: null });
}
