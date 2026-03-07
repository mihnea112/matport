// File: src/app/dashboard/admin/companies/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Company = {
  id: string;
  owner_user_id: string;
  legal_name: string;
  display_name: string | null;
  cui: string | null;
  city: string | null;
  county: string | null;
  is_verified: boolean;
  created_at: string;
};

export default function AdminCompaniesPage() {
  const [items, setItems] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [q, setQ] = useState("");

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

  const load = async (search: string) => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        setItems([]);
        setError(
          "Nu ești autentificat în Supabase Auth. Autentifică-te și reîncearcă.",
        );
        setLoading(false);
        return;
      }

      const res = await fetch(
        `/api/admin/companies?search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setItems([]);
        setError(json?.error ?? "Nu pot încărca companiile.");
        setErrorDetails(json?.debug ?? json ?? null);
        return;
      }

      setItems(
        Array.isArray(json?.companies) ? (json.companies as Company[]) : [],
      );
    } catch (e: any) {
      setItems([]);
      setError(e?.message ?? "Nu pot încărca companiile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await load(q);
  };

  const onToggleVerify = async (id: string, next: boolean) => {
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

      const res = await fetch(
        `/api/admin/companies/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_verified: next }),
        },
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error ?? "Nu pot actualiza compania.");
        setErrorDetails(json?.debug ?? json ?? null);
        return;
      }

      setItems((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_verified: next } : c)),
      );
    } catch (e: any) {
      setError(e?.message ?? "Nu pot actualiza compania.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#111418]">Admin · Companii</h1>
        <p className="text-sm text-[#617289] mt-1">
          Vezi toate companiile și marchează-le ca verificate.
        </p>
      </div>

      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input
          className="flex-1 h-10 px-3 rounded-md border border-[#e5e7eb]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Caută după nume / CUI…"
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
        <div className="text-sm text-[#617289]">Nicio companie găsită.</div>
      ) : (
        <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f8fafc] text-[#617289]">
                <tr>
                  <th className="text-left font-bold px-6 py-3">Companie</th>
                  <th className="text-left font-bold px-6 py-3">CUI</th>
                  <th className="text-left font-bold px-6 py-3">Locație</th>
                  <th className="text-left font-bold px-6 py-3">Verificare</th>
                  <th className="text-right font-bold px-6 py-3">Creat</th>
                  <th className="text-right font-bold px-6 py-3">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => {
                  const name = (c.display_name ?? "").trim() || c.legal_name;
                  const loc =
                    [c.city, c.county].filter(Boolean).join(", ") || "România";

                  return (
                    <tr
                      key={c.id}
                      className="border-t border-[#e2e8f0] hover:bg-[#fafbfc]"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#111418] truncate max-w-[420px]">
                          {name}
                        </div>
                        <div className="text-xs font-mono text-[#617289] truncate max-w-[420px]">
                          {c.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">{c.cui ?? "—"}</td>
                      <td className="px-6 py-4">{loc}</td>
                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold",
                            c.is_verified
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200",
                          ].join(" ")}
                        >
                          {c.is_verified ? "verificat" : "neverificat"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[#617289] font-mono">
                        {formatDate(c.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={busyId === c.id}
                          onClick={() => onToggleVerify(c.id, !c.is_verified)}
                          className={[
                            "h-8 px-3 inline-flex items-center rounded-md border text-xs font-bold disabled:opacity-60",
                            c.is_verified
                              ? "border-gray-200 bg-gray-50 text-gray-700"
                              : "border-green-200 bg-green-50 text-green-700",
                          ].join(" ")}
                        >
                          {busyId === c.id
                            ? "Se salvează…"
                            : c.is_verified
                              ? "Revocă"
                              : "Verifică"}
                        </button>
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
  );
}
