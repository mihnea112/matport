"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Listing = {
  id: string;
  title: string;
  created_at?: string | null;
};

export default function AdminListingsPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [token, setToken] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (t: string, query?: string) => {
    setLoading(true);
    setError(null);

    const url = query?.trim()
      ? `/api/admin/listings?q=${encodeURIComponent(query.trim())}`
      : "/api/admin/listings";

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${t}` },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(json?.error ?? "Failed to load listings");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(Array.isArray(json?.listings) ? json.listings : []);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const t = data.session?.access_token ?? null;
      if (!t) return router.replace("/login");
      setToken(t);
      await load(t);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase]);

  const onDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Ștergi listarea?")) return;

    setError(null);
    const res = await fetch(
      `/api/admin/listings?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json?.error ?? "Failed to delete listing");

    await load(token, q);
  };

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-black text-[#111418]">
        Admin · Moderare Listări
      </h1>
      <p className="text-sm text-text-muted mt-1">Caută și șterge listări.</p>

      {error && (
        <div className="mt-6 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 bg-white border border-[#e2e8f0] rounded-lg p-5 flex gap-3 items-center">
        <input
          className="flex-1 h-11 px-4 rounded-md border border-[#e2e8f0]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Caută după titlu…"
        />
        <button
          type="button"
          onClick={() => token && load(token, q)}
          className="h-11 px-5 rounded-md bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
        >
          Caută
        </button>
      </div>

      <div className="mt-6 bg-white border border-[#e2e8f0] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-sm font-bold">Rezultate</h2>
          <button
            type="button"
            onClick={() => token && load(token, q)}
            className="text-sm font-bold text-primary hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-text-muted">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-text-muted">
            Nicio listare găsită.
          </div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {items.map((l) => (
              <div
                key={l.id}
                className="p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#111418] truncate">
                    {l.title}
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    {l.id}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(l.id)}
                  className="h-9 px-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm font-bold shrink-0"
                >
                  Șterge
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
