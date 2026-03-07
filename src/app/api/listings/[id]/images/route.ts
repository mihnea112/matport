import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

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

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  console.log("[api/listings/:id/images] POST", { id });

  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  console.log("[api/listings/:id/images] auth header", {
    hasAuthHeader: Boolean(authHeader),
    hasBearer: Boolean(bearer),
  });

  const supabase = bearer ? supabaseFromBearer(bearer) : await supabaseServer();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  console.log("[api/listings/:id/images] getUser", {
    userId: user?.id ?? null,
    email: user?.email ?? null,
    uErr: uErr?.message ?? null,
  });

  if (uErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: { storage_path?: string; sort_order?: number } = await req
    .json()
    .catch(() => ({}));

  const storage_path = body.storage_path?.trim();
  const sort_order = Number.isFinite(body.sort_order) ? body.sort_order! : 0;

  console.log("[api/listings/:id/images] payload", {
    storage_path: storage_path ?? null,
    sort_order,
  });

  if (!storage_path) {
    return NextResponse.json({ error: "storage_path required" }, { status: 400 });
  }

  // Ownership check: only the owner of the listing's seller_company_id may attach images
  const { data: listing, error: lErr } = await supabase
    .from("listings")
    .select("seller_company_id")
    .eq("id", id)
    .maybeSingle();

  console.log("[api/listings/:id/images] listing lookup", {
    id,
    seller_company_id: (listing as any)?.seller_company_id ?? null,
    lErr: lErr?.message ?? null,
  });

  if (lErr) {
    return NextResponse.json({ error: lErr.message }, { status: 400 });
  }
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: company, error: cErr } = await supabase
    .from("companies")
    .select("id")
    .eq("id", (listing as any).seller_company_id)
    .eq("owner_user_id", user.id)
    .maybeSingle();

  console.log("[api/listings/:id/images] ownership check", {
    listingSellerCompanyId: (listing as any)?.seller_company_id ?? null,
    companyFound: Boolean((company as any)?.id),
    cErr: cErr?.message ?? null,
    userId: user?.id ?? null,
  });

  if (cErr) {
    return NextResponse.json({ error: cErr.message }, { status: 400 });
  }
  if (!company) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  console.log("[api/listings/:id/images] inserting listing_images", {
    listing_id: id,
    storage_path,
    sort_order,
  });

  const { data, error } = await supabase
    .from("listing_images")
    .insert({ listing_id: id, storage_path, sort_order })
    .select("*")
    .single();

  console.log("[api/listings/:id/images] insert result", {
    ok: !error,
    error: error?.message ?? null,
    errorCode: (error as any)?.code ?? null,
    errorDetails: (error as any)?.details ?? null,
    errorHint: (error as any)?.hint ?? null,
  });

  if (error) {
    console.error("[api/listings/:id/images] listing_images insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ image: data }, { status: 201 });
}
