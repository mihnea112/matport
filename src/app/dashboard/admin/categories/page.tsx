"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Category = {
  id: string;
  name: string;
  slug: string;
  image_path?: string | null;
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

function uuid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

  const [createImageFile, setCreateImageFile] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);
  const [createImagePath, setCreateImagePath] = useState<string | null>(null);
  const [uploadingCreateImage, setUploadingCreateImage] = useState(false);

  const [rowUploadingId, setRowUploadingId] = useState<string | null>(null);

  const getPublicImageUrl = (path?: string | null) => {
    if (!path) return null;
    try {
      const { data } = supabase.storage.from("category-images").getPublicUrl(path);
      return data?.publicUrl ?? null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  useEffect(() => {
    if (!createImageFile) {
      setCreateImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(createImageFile);
    setCreateImagePreview(url);
    return () => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    };
  }, [createImageFile]);

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

  const uploadCategoryImage = async (file: File) => {
    const ext = file.name.split(".").pop() || "bin";
    const key = `categories/${uuid()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("category-images")
      .upload(key, file, {
        upsert: false,
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      });

    if (upErr) throw new Error(upErr.message);
    return key;
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    const n = name.trim();
    const s = slugify(slug || name);
    if (!n) return setError("Completează numele categoriei.");
    if (!s) return setError("Slug invalid.");

    let image_path: string | null = createImagePath;

    // If a file is selected but not uploaded yet, upload now
    if (createImageFile && !image_path) {
      try {
        setUploadingCreateImage(true);
        image_path = await uploadCategoryImage(createImageFile);
        setCreateImagePath(image_path);
      } finally {
        setUploadingCreateImage(false);
      }
    }

    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: n, slug: s, image_path }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) return setError(json?.error ?? "Failed to create category");

    setName("");
    setSlug("");
    setCreateImageFile(null);
    setCreateImagePreview(null);
    setCreateImagePath(null);
    await load(token);
  };

  const onChangeImage = async (id: string, file: File) => {
    if (!token) return;
    setError(null);
    setRowUploadingId(id);

    try {
      const image_path = await uploadCategoryImage(file);

      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, image_path }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Failed to update image");

      await load(token);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update image");
    } finally {
      setRowUploadingId(null);
    }
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

          <div className="md:col-span-12">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wide mb-1">
              Imagine categorie (opțional)
            </label>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-md border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                {createImagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={createImagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[11px] text-text-muted">N/A</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="h-11 inline-flex items-center px-4 rounded-md border border-[#e2e8f0] bg-white text-sm font-bold text-[#111418] hover:bg-gray-50 cursor-pointer">
                  Alege imagine
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setCreateImageFile(f);
                      setCreateImagePath(null);
                    }}
                  />
                </label>

                {createImageFile && (
                  <button
                    type="button"
                    className="h-11 px-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm font-bold"
                    onClick={() => {
                      setCreateImageFile(null);
                      setCreateImagePreview(null);
                      setCreateImagePath(null);
                    }}
                  >
                    Elimină
                  </button>
                )}

                {(uploadingCreateImage || saving) && createImageFile && (
                  <span className="text-sm text-text-muted">Se încarcă…</span>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Se încarcă în bucket-ul <span className="font-mono">category-images</span>.
            </p>
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
            disabled={loading}
            onClick={() => token && load(token)}
            className="text-sm font-bold text-primary hover:underline disabled:opacity-60"
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
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-md border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden shrink-0">
                      {c.image_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getPublicImageUrl(c.image_path) ?? ""}
                          alt={c.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-[#111418] truncate">{c.name}</div>
                      <div className="text-xs text-text-muted font-mono">/{c.slug}</div>
                      {rowUploadingId === c.id && (
                        <div className="text-[11px] text-text-muted mt-1">Se încarcă imaginea…</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="h-9 px-3 rounded-md border border-[#e2e8f0] bg-white text-[#111418] text-sm font-bold hover:bg-gray-50 cursor-pointer">
                      Schimbă imagine
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          onChangeImage(c.id, f);
                          // reset input so selecting same file again works
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>

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