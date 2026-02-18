"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Category = {
  id: string;
  name: string;
  slug: string;
  is_active?: boolean | null;
  sort_order?: number | null;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

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

  const load = async (t: string) => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/categories", {
      headers: { Authorization: `Bearer ${t}` },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(json?.error ?? "Failed to load categories");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(Array.isArray(json?.categories) ? json.categories : []);
    setLoading(false);
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    const n = name.trim();
    const s = slugify(slug || name);
    if (!n) return setError("Completează numele categoriei.");
    if (!s) return setError("Slug invalid.");

    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: n, slug: s }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) return setError(json?.error ?? "Failed to create category");

    setName("");
    setSlug("");
    await load(token);
  };

  const onToggle = async (id: string, next: boolean) => {
    if (!token) return;
    setError(null);

    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, is_active: next }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json?.error ?? "Failed to update category");
    await load(token);
  };

  const onDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Ștergi categoria?")) return;

    setError(null);
    const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError(json?.error ?? "Failed to delete category");
    await load(token);
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-black text-[#111418]">Admin · Categorii</h1>
      <p className="text-sm text-text-muted mt-1">Creează și gestionează categoriile.</p>

      {error && (
        <div className="mt-6 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onCreate} className="mt-6 bg-white border border-[#e2e8f0] rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wide mb-1">Nume</label>
            <input
              className="w-full h-11 px-4 rounded-md border border-[#e2e8f0]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Izolații"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wide mb-1">Slug</label>
            <input
              className="w-full h-11 px-4 rounded-md border border-[#e2e8f0] font-mono text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex. izolatii"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 rounded-md bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Salvez…" : "Adaugă"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 bg-white border border-[#e2e8f0] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-sm font-bold">Lista categorii</h2>
          <button
            type="button"
            onClick={() => token && load(token)}
            className="text-sm font-bold text-primary hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-text-muted">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-text-muted">Nicio categorie încă.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {items.map((c) => {
              const active = c.is_active ?? true;
              return (
                <div key={c.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-bold text-[#111418] truncate">{c.name}</div>
                    <div className="text-xs text-text-muted font-mono">/{c.slug}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggle(c.id, !active)}
                      className={[
                        "h-9 px-3 rounded-md border text-sm font-bold",
                        active
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-gray-200 bg-gray-50 text-gray-700",
                      ].join(" ")}
                    >
                      {active ? "Activ" : "Inactiv"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(c.id)}
                      className="h-9 px-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm font-bold"
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}