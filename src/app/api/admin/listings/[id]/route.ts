import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Ctx = { params: Promise<{ id: string }> };

type Json = Record<string, any>;

function json(body: Json, status = 200) {
  return NextResponse.json(body, { status });
}

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

async function getAuthAndRole(supabase: any) {
  const { data: uData, error: uErr } = await supabase.auth.getUser();
  const user = uData?.user ?? null;
  const userId = user?.id ?? null;

  if (uErr || !userId) {
    return { ok: false as const, status: 401, userId: null, role: null as string | null };
  }

  // IMPORTANT: avoid maybeSingle/single because duplicates can exist
  const { data: rows, error: rErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .limit(1);

  if (rErr) {
    return { ok: false as const, status: 400, userId, role: null as string | null, roleErr: rErr.message };
  }

  const first = Array.isArray(rows) ? rows[0] : null;
  const role = (first as any)?.role ?? null;

  return { ok: true as const, status: 200, userId, role };
}

async function fetchListingDetails(supabase: any, id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id,seller_company_id,status,category_id,title,description,quantity,unit,price_total,currency,pickup_city,pickup_county,created_at,updated_at,listing_images(id,storage_path,sort_order),seller_company:companies(id,legal_name,display_name,cui,is_verified,city,county)"
    )
    .eq("id", id)
    .limit(1);

  if (error) return { listing: null as any, error: error.message };
  const first = Array.isArray(data) ? data[0] : null;
  return { listing: first, error: null as string | null };
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!bearer) {
    return json({ error: "Unauthorized", debug: { hasBearer: false } }, 401);
  }

  const supabase = supabaseFromBearer(bearer);

  let auth;
  try {
    auth = await getAuthAndRole(supabase);
  } catch (e: any) {
    console.error("[api/admin/listings/:id] GET auth error", e);
    return json(
      {
        error: "Supabase auth/network failure",
        debug: { message: e?.message ?? String(e), cause: e?.cause?.message ?? null },
      },
      503,
    );
  }

  if (!auth.ok) {
    return json({ error: auth.status === 401 ? "Unauthorized" : "Bad Request", debug: auth }, auth.status);
  }

  if (auth.role !== "admin") {
    return json({ error: "Forbidden", debug: { userId: auth.userId, role: auth.role } }, 403);
  }

  const { listing, error } = await fetchListingDetails(supabase, id);
  if (error) return json({ error }, 400);
  if (!listing) return json({ error: "Not found" }, 404);

  return json({ listing }, 200);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!bearer) {
    return json({ error: "Unauthorized", debug: { hasBearer: false } }, 401);
  }

  const supabase = supabaseFromBearer(bearer);

  console.log("[api/admin/listings/:id] PATCH", { id, hasBearer: true });

  let auth;
  try {
    auth = await getAuthAndRole(supabase);
  } catch (e: any) {
    console.error("[api/admin/listings/:id] auth error", e);
    return json(
      {
        error: "Supabase auth/network failure",
        debug: { message: e?.message ?? String(e), cause: e?.cause?.message ?? null },
      },
      503,
    );
  }

  console.log("[api/admin/listings/:id] auth", { userId: auth.userId, role: auth.role });

  if (!auth.ok) {
    return json({ error: auth.status === 401 ? "Unauthorized" : "Bad Request", debug: auth }, auth.status);
  }

  if (auth.role !== "admin") {
    return json({ error: "Forbidden", debug: { userId: auth.userId, role: auth.role } }, 403);
  }

  const body = await req.json().catch(() => ({} as any));
  const nextStatus = String(body?.status ?? "").trim();

  // Match your enum values
  if (nextStatus !== "active" && nextStatus !== "draft") {
    return json({ error: "invalid status", debug: { nextStatus } }, 400);
  }

  const { data: rows, error } = await supabase
    .from("listings")
    .update({ status: nextStatus })
    .eq("id", id)
    .select("id,status")
    .limit(1);

  console.log("[api/admin/listings/:id] update", {
    ok: !error,
    error: error?.message ?? null,
    code: (error as any)?.code ?? null,
    details: (error as any)?.details ?? null,
    hint: (error as any)?.hint ?? null,
    rows: Array.isArray(rows) ? rows.length : null,
  });

  if (error) {
    return json(
      {
        error: error.message,
        debug: { code: (error as any)?.code ?? null, details: (error as any)?.details ?? null, hint: (error as any)?.hint ?? null },
      },
      400,
    );
  }

  let updated = Array.isArray(rows) ? rows[0] : null;

  // In some setups UPDATE may return 0 rows even if it succeeded; fetch the row to confirm.
  if (!updated) {
    const { listing } = await fetchListingDetails(supabase, id);
    updated = listing ? { id: (listing as any).id, status: (listing as any).status } : null;
  }

  if (!updated) return json({ error: "Not found" }, 404);

  return json({ listing: updated }, 200);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!bearer) {
    return json({ error: "Unauthorized", debug: { hasBearer: false } }, 401);
  }

  const supabase = supabaseFromBearer(bearer);

  console.log("[api/admin/listings/:id] DELETE", { id, hasBearer: true });

  let auth;
  try {
    auth = await getAuthAndRole(supabase);
  } catch (e: any) {
    console.error("[api/admin/listings/:id] auth error", e);
    return json(
      {
        error: "Supabase auth/network failure",
        debug: { message: e?.message ?? String(e), cause: e?.cause?.message ?? null },
      },
      503,
    );
  }

  if (!auth.ok) {
    return json({ error: auth.status === 401 ? "Unauthorized" : "Bad Request", debug: auth }, auth.status);
  }

  if (auth.role !== "admin") {
    return json({ error: "Forbidden", debug: { userId: auth.userId, role: auth.role } }, 403);
  }

  // Gather image paths for best-effort storage deletion
  const { data: imgRows, error: imgErr } = await supabase
    .from("listing_images")
    .select("storage_path")
    .eq("listing_id", id);

  if (imgErr) {
    return json({ error: imgErr.message }, 400);
  }

  const paths = (imgRows ?? [])
    .map((r: any) => String(r?.storage_path ?? "").trim())
    .filter(Boolean);

  // Delete DB rows first
  const { error: delImgsErr } = await supabase
    .from("listing_images")
    .delete()
    .eq("listing_id", id);

  if (delImgsErr) {
    return json({ error: delImgsErr.message }, 400);
  }

  // Best-effort delete from storage (doesn't block listing deletion)
  if (paths.length > 0) {
    const { error: storageErr } = await supabase.storage
      .from("listing-images")
      .remove(paths);

    if (storageErr) {
      console.warn("[api/admin/listings/:id] storage remove failed", storageErr);
    }
  }

  const { error: delListingErr } = await supabase.from("listings").delete().eq("id", id);

  if (delListingErr) {
    return json({ error: delListingErr.message }, 400);
  }

  return json({ ok: true, deleted_images: paths.length }, 200);
}