"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type ListingRow = {
  id: string;
  title: string;
  status: string;
  quantity: string | number;
  unit: string;
  price_total: string | number;
  currency: string;
  pickup_city: string | null;
  pickup_county: string | null;
  created_at: string;
};

function toNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function formatMoney(value: unknown, currency: unknown) {
  const n = toNumber(value);
  const c = String(currency ?? "RON").trim() || "RON";
  if (n === null) return "—";
  return `${n.toLocaleString("ro-RO")} ${c}`;
}

function formatQty(value: unknown, unit: unknown) {
  const u = String(unit ?? "").trim();
  if (value === null || value === undefined || value === "") return "—";
  return `${String(value)}${u ? ` ${u}` : ""}`;
}

function badgeClasses(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "bg-green-50 text-green-700 border-green-200";
  if (s === "draft") return "bg-gray-50 text-gray-700 border-gray-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function SellerDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState<string>("");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const authed = Boolean(data.session);

      if (!authed) {
        router.replace("/login");
        return;
      }

      if (!mounted) return;
      setChecking(false);

      const userId = data.session?.user?.id;
      if (!userId) {
        router.replace("/login");
        return;
      }

      // Load single company for this user
      const { data: companyRows, error: cErr } = await supabase
        .from("companies")
        .select("id, legal_name, display_name")
        .eq("owner_user_id", userId)
        .limit(1);

      if (cErr) {
        setError(`Eroare la încărcarea companiei: ${cErr.message}`);
        setLoadingListings(false);
        return;
      }

      const company = Array.isArray(companyRows) ? companyRows[0] : null;

      if (!company?.id) {
        setCompanyId(null);
        setCompanyName("");
        setListings([]);
        setLoadingListings(false);
        return;
      }

      setCompanyId(String(company.id));
      setCompanyName(
        String((company as any).display_name ?? "").trim() ||
          String((company as any).legal_name ?? "").trim() ||
          "Companie",
      );

      // Load listings for this company
      const { data: rows, error: lErr } = await supabase
        .from("listings")
        .select(
          "id,title,status,quantity,unit,price_total,currency,pickup_city,pickup_county,created_at",
        )
        .eq("seller_company_id", company.id)
        .order("created_at", { ascending: false })
        .limit(200);

      if (lErr) {
        setError(`Eroare la încărcarea listărilor: ${lErr.message}`);
        setListings([]);
      } else {
        setListings(Array.isArray(rows) ? (rows as any) : []);
      }

      setLoadingListings(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const authed = Boolean(session);
      if (!authed) {
        router.replace("/login");
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const deleteListing = async (id: string) => {
    if (deletingId) return;
    const ok = window.confirm("Ștergi listarea? Această acțiune nu poate fi anulată.");
    if (!ok) return;

    setDeletingId(id);
    setError(null);

    try {
      const { data, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw new Error(sErr.message);
      const token = data.session?.access_token;
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch(`/api/listings/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error ? String(json.error) : "Nu pot șterge listarea.");
      }

      // optimistic UI
      setListings((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e?.message ?? "Nu pot șterge listarea.");
    } finally {
      setDeletingId(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <p className="text-sm text-gray-600">Checking session…</p>
      </div>
    );
  }

  // If user has no company
  if (!loadingListings && !companyId) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#111418]">Listările Mele</h1>
          <p className="text-sm text-[#617289] mt-1">
            Nu ai o companie asociată contului. Înregistrează-te ca Persoană juridică.
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-5 py-2.5 rounded-md shadow-sm transition-colors text-sm"
        >
          Mergi la înregistrare
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 lg:px-8">
        <div className="hidden md:flex items-center text-sm text-text-muted">
          <span>Panou de control</span>
          <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
          <span className="text-text-main font-medium">Listările Mele</span>
        </div>

        <div className="flex items-center gap-4">
          {companyName && (
            <div className="hidden md:flex items-center gap-2 text-xs text-[#617289]">
              <span className="material-symbols-outlined text-base">business</span>
              <span className="font-bold text-[#111418]">{companyName}</span>
            </div>
          )}

          <button
            className="relative p-2 text-text-muted hover:text-primary transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#111418]">Listările Mele</h1>
            <p className="text-sm text-text-muted mt-1">Gestionează inventarul, prețurile și vizibilitatea.</p>
          </div>

          <Link
            href="/list-item"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-5 py-2.5 rounded-md shadow-sm transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Adaugă Listare Nouă
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        )}

        {loadingListings ? (
          <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-6">
            <p className="text-sm text-text-muted">Se încarcă listările…</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-6">
            <p className="text-sm text-text-muted">Nu ai încă nicio listare.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0]">
              <div className="text-sm font-bold text-[#111418]">Listări ({listings.length})</div>
              <div className="text-xs text-[#617289]">Draft-urile nu apar public până când sunt activate de admin.</div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#f8fafc] text-[#617289]">
                  <tr>
                    <th className="text-left font-bold px-6 py-3">Titlu</th>
                    <th className="text-left font-bold px-6 py-3">Status</th>
                    <th className="text-left font-bold px-6 py-3">Cantitate</th>
                    <th className="text-left font-bold px-6 py-3">Preț total</th>
                    <th className="text-left font-bold px-6 py-3">Ridicare</th>
                    <th className="text-right font-bold px-6 py-3">Creat</th>
                    <th className="text-right font-bold px-6 py-3">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => {
                    const status = String(l.status ?? "");
                    const loc = [l.pickup_city, l.pickup_county].filter(Boolean).join(", ") || "România";
                    const created = l.created_at
                      ? new Date(l.created_at).toLocaleDateString("ro-RO")
                      : "";

                    return (
                      <tr key={l.id} className="border-t border-[#e2e8f0] hover:bg-[#fafbfc]">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#111418] truncate max-w-[420px]">{l.title}</div>
                          <div className="text-xs font-mono text-[#617289] truncate max-w-[420px]">{l.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={
                              [
                                "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold",
                                badgeClasses(status),
                              ].join(" ")
                            }
                          >
                            {status || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">{formatQty(l.quantity, l.unit)}</td>
                        <td className="px-6 py-4 font-bold text-[#111418]">{formatMoney(l.price_total, l.currency)}</td>
                        <td className="px-6 py-4 text-[#111418]">{loc}</td>
                        <td className="px-6 py-4 text-right text-[#617289] font-mono">{created}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Link
                              href={`/list-item?edit=${encodeURIComponent(String(l.id))}`}
                              className="h-8 px-3 inline-flex items-center rounded-md border border-[#e2e8f0] bg-white text-[#111418] text-xs font-bold hover:bg-[#f8fafc]"
                            >
                              Editează
                            </Link>
                            <button
                              type="button"
                              disabled={deletingId === l.id}
                              onClick={() => deleteListing(String(l.id))}
                              className="h-8 px-3 inline-flex items-center rounded-md border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 disabled:opacity-60"
                            >
                              {deletingId === l.id ? "Se șterge…" : "Șterge"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
