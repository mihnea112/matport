// File: src/app/dashboard/admin/listings/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Listing = {
  id: string;
  title: string;
  status?: string | null;
  created_at?: string | null;
  price_total?: number | string | null;
  currency?: string | null;
  quantity?: number | string | null;
  unit?: string | null;
  pickup_city?: string | null;
  pickup_county?: string | null;
  category_id?: number | null;
};

export default function AdminListingsPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [q, setQ] = useState("");

  // Preview state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailsById, setDetailsById] = useState<Record<string, any>>({});
  const [detailsLoadingId, setDetailsLoadingId] = useState<string | null>(null);
  const [detailsErrorById, setDetailsErrorById] = useState<
    Record<string, string>
  >({});

  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: true, autoRefreshToken: true } },
    );
  }, []);

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("ro-RO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatMoney = (value?: number | string | null, cur?: string | null) => {
    if (value === null || value === undefined || value === "") return null;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return null;
    const c = (cur ?? "RON").toString().trim() || "RON";
    return `${n.toLocaleString("ro-RO")} ${c}`;
  };

  const getPublicImageUrl = (storagePath?: string | null) => {
    if (!storagePath) return null;
    try {
      const { data } = supabase.storage
        .from("listing-images")
        .getPublicUrl(storagePath);
      return data?.publicUrl ?? null;
    } catch {
      return null;
    }
  };

  const loadDetails = async (id: string) => {
    setDetailsLoadingId(id);
    setDetailsErrorById((prev) => ({ ...prev, [id]: "" }));

    try {
      const token = await getAccessToken();
      if (!token) {
        setDetailsErrorById((prev) => ({
          ...prev,
          [id]: "Nu ești autentificat în Supabase Auth.",
        }));
        return;
      }

      const res = await fetch(`/api/admin/listings/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDetailsErrorById((prev) => ({
          ...prev,
          [id]: json?.error ?? "Nu pot încărca detaliile.",
        }));
        return;
      }

      setDetailsById((prev) => ({ ...prev, [id]: json?.listing ?? null }));
    } finally {
      setDetailsLoadingId(null);
    }
  };

  const togglePreview = async (id: string) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);

    if (next && !detailsById[id] && detailsLoadingId !== id) {
      await loadDetails(id);
    }
  };

  const load = async (search: string) => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      const token = await getAccessToken();
      const headers: Record<string, string> = {};
      if (!token) {
        setItems([]);
        setError(
          "Nu ești autentificat în Supabase Auth. Autentifică-te și reîncearcă.",
        );
        setLoading(false);
        return;
      }
      headers.Authorization = `Bearer ${token}`;

      const res = await fetch(
        `/api/admin/listings?search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        },
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[admin/listings] load failed", {
          status: res.status,
          json,
        });
        setItems([]);
        setError(json?.error ?? "Nu pot încărca listările.");
        setErrorDetails(json?.debug ?? json ?? null);
        return;
      }

      setItems(
        Array.isArray(json?.listings) ? (json.listings as Listing[]) : [],
      );
    } catch {
      setItems([]);
      setError("Nu pot încărca listările.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await load(q);
  };

  const onToggle = async (id: string, nextActive: boolean) => {
    if (busyId) return;
    setBusyId(id);
    setError(null);
    setErrorDetails(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        setError(
          "Nu ești autentificat în Supabase Auth. Autentifică-te și reîncearcă.",
        );
        return;
      }

      const res = await fetch(`/api/admin/listings/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextActive ? "active" : "draft" }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[admin/listings] toggle failed", {
          status: res.status,
          json,
        });
        setError(json?.error ?? "Nu pot actualiza statusul.");
        setErrorDetails(json?.debug ?? json ?? null);
        return;
      }

      setItems((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, status: nextActive ? "active" : "draft" } : x,
        ),
      );

      // also update cached details if open
      setDetailsById((prev) => {
        const d = prev[id];
        if (!d) return prev;
        return {
          ...prev,
          [id]: { ...d, status: nextActive ? "active" : "draft" },
        };
      });

      await load(q);
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (id: string) => {
    if (busyId) return;
    if (!confirm("Ștergi listarea?")) return;

    setBusyId(id);
    setError(null);
    setErrorDetails(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        setError(
          "Nu ești autentificat în Supabase Auth. Autentifică-te și reîncearcă.",
        );
        return;
      }

      const res = await fetch(`/api/admin/listings/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[admin/listings] delete failed", {
          status: res.status,
          json,
        });
        setError(json?.error ?? "Nu pot șterge listarea.");
        setErrorDetails(json?.debug ?? json ?? null);
        return;
      }

      setItems((prev) => prev.filter((x) => x.id !== id));
      setDetailsById((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (expandedId === id) setExpandedId(null);

      await load(q);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#111418]">Admin · Listări</h1>
        <p className="text-sm text-[#617289] mt-1">
          Caută și publică listări. Doar{" "}
          <span className="font-mono">active</span> apar pe homepage.
        </p>
      </div>

      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input
          className="flex-1 h-10 px-3 rounded-md border border-[#e5e7eb]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Caută după titlu / ID…"
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-md bg-primary text-white font-bold"
        >
          Caută
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
          <div className="font-bold">{error}</div>
          {errorDetails && (
            <pre className="mt-2 text-[11px] whitespace-pre-wrap break-words text-red-800/80">
              {JSON.stringify(errorDetails, null, 2)}
            </pre>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-[#617289]">Se încarcă…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-[#617289]">Nicio listare găsită.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((l) => (
            <React.Fragment key={l.id}>
              <div className="flex items-center justify-between gap-4 bg-white border border-[#e5e7eb] rounded-lg p-4">
                <div className="min-w-0">
                  <div className="font-bold text-[#111418] truncate">
                    {l.title}
                  </div>
                  <div className="text-xs text-[#617289] font-mono truncate">
                    {l.id}
                  </div>

                  <div className="mt-1 text-xs text-[#617289]">
                    Status:{" "}
                    <span className="font-mono">
                      {l.status ?? "(necunoscut)"}
                    </span>
                    {busyId === l.id && (
                      <span className="ml-2 text-[11px]">Se actualizează…</span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#617289]">
                    {formatMoney(l.price_total ?? null, l.currency ?? null) && (
                      <span>
                        Preț:{" "}
                        <span className="font-bold text-[#111418]">
                          {formatMoney(
                            l.price_total ?? null,
                            l.currency ?? null,
                          )}
                        </span>
                      </span>
                    )}
                    {(l.quantity ?? "") !== "" && l.quantity !== null && (
                      <span>
                        Cantitate:{" "}
                        <span className="font-mono">{String(l.quantity)}</span>{" "}
                        <span className="font-mono">{l.unit ?? ""}</span>
                      </span>
                    )}
                    {(l.pickup_city || l.pickup_county) && (
                      <span>
                        Ridicare:{" "}
                        <span className="font-mono">{l.pickup_city ?? ""}</span>
                        {l.pickup_county ? `, ${l.pickup_county}` : ""}
                      </span>
                    )}
                    {l.category_id !== null && l.category_id !== undefined && (
                      <span>
                        Category ID:{" "}
                        <span className="font-mono">
                          {String(l.category_id)}
                        </span>
                      </span>
                    )}
                    {l.created_at && (
                      <span>
                        Creat:{" "}
                        <span className="font-mono">
                          {formatDate(l.created_at)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={busyId === l.id}
                    onClick={() => togglePreview(l.id)}
                    className="h-9 px-3 rounded-md border border-[#e5e7eb] bg-white text-[#111418] text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {expandedId === l.id ? "Închide" : "Previzualizează"}
                  </button>

                  <button
                    type="button"
                    disabled={busyId === l.id}
                    onClick={() =>
                      onToggle(l.id, (l.status ?? "") !== "active")
                    }
                    className={[
                      "h-9 px-3 rounded-md border text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed",
                      (l.status ?? "") === "active"
                        ? "border-gray-200 bg-gray-50 text-gray-700"
                        : "border-green-200 bg-green-50 text-green-700",
                    ].join(" ")}
                  >
                    {(l.status ?? "") === "active"
                      ? "Dezactivează"
                      : "Activează"}
                  </button>

                  <button
                    type="button"
                    disabled={busyId === l.id}
                    onClick={() => onDelete(l.id)}
                    className="h-9 px-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Șterge
                  </button>
                </div>
              </div>

              {expandedId === l.id && (
                <div className="-mt-2 mb-3 bg-white border border-[#e5e7eb] rounded-lg p-4">
                  {detailsLoadingId === l.id ? (
                    <div className="text-sm text-[#617289]">
                      Se încarcă detaliile…
                    </div>
                  ) : detailsErrorById[l.id] ? (
                    <div className="text-sm text-red-700">
                      {detailsErrorById[l.id]}
                    </div>
                  ) : (
                    (() => {
                      const d = detailsById[l.id];
                      if (!d)
                        return (
                          <div className="text-sm text-[#617289]">
                            Nu există detalii.
                          </div>
                        );

                      const imgs: any[] = Array.isArray(d?.listing_images)
                        ? d.listing_images
                        : [];
                      const sorted = imgs
                        .slice()
                        .sort(
                          (a, b) =>
                            Number(a?.sort_order ?? 0) -
                            Number(b?.sort_order ?? 0),
                        );

                      const company = d?.seller_company ?? null;

                      return (
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <div className="text-xs uppercase tracking-wide text-[#617289] font-bold">
                                Descriere
                              </div>
                              <div className="mt-1 text-sm text-[#111418] whitespace-pre-wrap">
                                {d.description || "(fără descriere)"}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs uppercase tracking-wide text-[#617289] font-bold">
                                Vânzător
                              </div>
                              <div className="mt-1 text-sm text-[#111418]">
                                {company ? (
                                  <div className="flex flex-col gap-1">
                                    <div className="font-bold">
                                      {company.display_name ||
                                        company.legal_name}
                                    </div>
                                    <div className="text-xs text-[#617289] font-mono">
                                      CUI: {company.cui ?? "-"}
                                    </div>
                                    <div className="text-xs text-[#617289]">
                                      {company.city || ""}
                                      {company.county
                                        ? `, ${company.county}`
                                        : ""}
                                    </div>
                                    <div className="text-xs">
                                      Verificat:{" "}
                                      {company.is_verified ? "DA" : "NU"}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-[#617289] font-mono">
                                    seller_company_id: {d.seller_company_id}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs uppercase tracking-wide text-[#617289] font-bold">
                              Fotografii
                            </div>
                            {sorted.length === 0 ? (
                              <div className="mt-1 text-sm text-[#617289]">
                                (fără imagini)
                              </div>
                            ) : (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {sorted.map((im) => {
                                  const url = getPublicImageUrl(
                                    im.storage_path,
                                  );
                                  return (
                                    <a
                                      key={im.id ?? im.storage_path}
                                      href={url ?? "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block"
                                    >
                                      <div
                                        className="h-20 w-20 rounded-md border border-[#e5e7eb] bg-[#f8fafc] bg-cover bg-center"
                                        style={{
                                          backgroundImage: url
                                            ? `url(${url})`
                                            : undefined,
                                        }}
                                      />
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })()
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
