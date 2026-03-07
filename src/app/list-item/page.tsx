"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Category = { id: number | string; name: string; slug: string };

const SellerListing: React.FC = () => {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("Nou (Sigilat)");
  const [description, setDescription] = useState("");

  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [unit, setUnit] = useState("pcs");
  const [vatIncluded, setVatIncluded] = useState(false);

  const [quantity, setQuantity] = useState<string>("");
  const [minOrder, setMinOrder] = useState<string>("");

  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [pickupCounty, setPickupCounty] = useState("");
  const [pickupPostal, setPickupPostal] = useState("");

  const uuid = () => {
    // Safari/private modes can be weird; keep a fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = globalThis.crypto;
    if (c?.randomUUID) return c.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  type PendingUpload = {
    id: string;
    file: File;
    previewUrl: string;
    storagePath: string | null;
    uploading: boolean;
    error: string | null;
  };

  const [uploads, setUploads] = useState<PendingUpload[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const authed = Boolean(data.session);

      if (mounted) {
        setIsAuthed(authed);
        setCheckingAuth(false);
      }

      if (!authed) router.replace("/login");
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const authed = Boolean(session);
      setIsAuthed(authed);
      setCheckingAuth(false);
      if (!authed) router.replace("/login");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router, supabase]);

  useEffect(() => {
    (async () => {
      if (!isAuthed) return;

      try {
        setLoadingCategories(true);
        const res = await fetch("/api/admin/categories", { cache: "no-store" });
        const json = await res.json().catch(() => ({}));
        const cats = Array.isArray(json?.categories) ? (json.categories as Category[]) : [];
        setCategories(cats);
        // Default to first category if none selected
        if (!categoryId && cats[0]?.id != null) setCategoryId(String(cats[0].id));
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  const uploadOne = async (u: PendingUpload) => {
    const ext = u.file.name.split(".").pop() || "bin";
    const key = `tmp/${uuid()}.${ext}`;

    console.log("[list-item] upload start", {
      name: u.file.name,
      size: u.file.size,
      type: u.file.type,
      key,
    });

    setUploads((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, uploading: true, error: null } : x))
    );

    let upErr: any = null;
    try {
      const res = await supabase.storage
        .from("listing-images")
        .upload(key, u.file, {
          upsert: false,
          contentType: u.file.type || "application/octet-stream",
          cacheControl: "3600",
        });
      upErr = res.error;
    } catch (e: any) {
      upErr = { message: e?.message ?? String(e), cause: e?.cause?.message ?? null };
    }

    console.log("[list-item] upload result", {
      ok: !upErr,
      key,
      error: upErr?.message ?? null,
      cause: upErr?.cause ?? null,
    });

    if (upErr) {
      setUploads((prev) =>
        prev.map((x) =>
          x.id === u.id ? { ...x, uploading: false, error: upErr.message } : x
        )
      );
      return;
    }

    setUploads((prev) =>
      prev.map((x) =>
        x.id === u.id
          ? { ...x, uploading: false, storagePath: key, error: null }
          : x
      )
    );
  };

  const onPickFiles = async (picked: File[]) => {
    if (!picked.length) return;

    const newOnes: PendingUpload[] = picked.map((file) => ({
      id: uuid(),
      file,
      previewUrl: URL.createObjectURL(file),
      storagePath: null,
      uploading: true,
      error: null,
    }));

    setUploads((prev) => [...prev, ...newOnes]);

    for (const u of newOnes) {
      // eslint-disable-next-line no-await-in-loop
      await uploadOne(u);
    }
  };

  const removeUpload = async (uploadId: string) => {
    const target = uploads.find((u) => u.id === uploadId);
    if (!target) return;

    try {
      URL.revokeObjectURL(target.previewUrl);
    } catch {}

    if (target.storagePath) {
      const { error } = await supabase.storage
        .from("listing-images")
        .remove([target.storagePath]);
      if (error) console.warn("[list-item] storage remove failed", {
        message: error.message,
        name: target.storagePath,
      });
    }

    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
  };

  const uploadingAny = uploads.some((u) => u.uploading);
  const uploadErrors = uploads.filter((u) => u.error);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-sm text-gray-600">Checking session…</p>
      </div>
    );
  }

  if (!isAuthed) {
    // Redirect already triggered; avoid flash.
    return null;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Basic validation (MVP)
    if (!title.trim()) return setSubmitError("Completează titlul listării.");
    if (!categoryId) return setSubmitError("Selectează o categorie.");
    if (!Number.isFinite(Number(categoryId))) return setSubmitError("Categorie invalidă.");
    if (!pricePerUnit.trim()) return setSubmitError("Completează prețul per unitate.");
    if (!quantity.trim()) return setSubmitError("Completează cantitatea totală.");

    const price = Number(pricePerUnit);
    const qty = Number(quantity);
    if (!Number.isFinite(price) || price < 0) return setSubmitError("Preț invalid.");
    if (!Number.isFinite(qty) || qty <= 0) return setSubmitError("Cantitate invalidă.");

    if (uploadingAny) return setSubmitError("Așteaptă finalizarea încărcării pozelor.");
    if (uploadErrors.length > 0)
      return setSubmitError("Unele poze au eșuat la încărcare. Șterge-le sau reîncearcă.");

    setSubmitting(true);

    try {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) throw new Error(sessionErr.message);
      const token = sessionData.session?.access_token;
      if (!token) {
        router.replace("/login");
        return;
      }

      // Compute price_total from per-unit * quantity (your DB currently uses price_total in PATCH route)
      const price_total = price * qty;

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        quantity: qty,
        unit,
        price_total,
        pickup_city: pickupCity.trim() || null,
        pickup_county: pickupCounty.trim() || null,
        category_id: Number(categoryId),
        // Extra form fields (only used if your DB has these columns; your API can ignore unknown fields)
        condition,
        vat_included: vatIncluded,
        min_order: minOrder ? Number(minOrder) : null,
        pickup_address: pickupAddress.trim() || null,
        pickup_postal: pickupPostal.trim() || null,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error ? String(json.error) : "Failed to create listing.");
      }

      const listing = json?.listing;
      const listingId = String(listing?.id ?? "");

      // Optional: bind uploaded images
      if (listingId && uploads.length > 0) {
        const ready = uploads
          .filter((u) => u.storagePath)
          .map((u) => u.storagePath as string);

        for (let i = 0; i < ready.length; i++) {
          const storage_path = ready[i];

          const imgRes = await fetch(`/api/listings/${encodeURIComponent(listingId)}/images`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ storage_path, sort_order: i }),
          });

          const imgJson = await imgRes.json().catch(() => ({}));
          if (!imgRes.ok) {
            throw new Error(imgJson?.error ? String(imgJson.error) : "Failed to attach image.");
          }
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      setSubmitError(err?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-[#111418] font-display antialiased overflow-x-hidden min-h-screen">
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 py-8">

      
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#111418]">
              Listează Inventar Nou
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Creează o listare nouă pentru materiale surplus. Câmpurile marcate
              cu * sunt obligatorii.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-sm"
              type="button"
            >
              Salvează Ciornă
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <form
              action="#"
              className="space-y-6"
              method="POST"
              onSubmit={onSubmit}
            >
              {/* Step 1 */}
              <section className="bg-white rounded-lg border border-border-color shadow-sm overflow-hidden">
                <div className="bg-neutral-light/50 px-6 py-4 border-b border-border-color flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-seller-primary text-white text-xs font-bold">
                      1
                    </span>
                    Detalii Material
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    PARTEA 01/03
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                      htmlFor="title"
                    >
                      Titlu Listare *
                    </label>
                    <input
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                      id="title"
                      name="title"
                      placeholder="ex. Palet Cărămidă Porotherm 250mm"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Include marca și dimensiunile cheie.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                        htmlFor="category"
                      >
                        Categorie *
                      </label>
                          <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                            id="category"
                            name="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={loadingCategories}
                          >
                            {loadingCategories ? (
                              <option>Se încarcă…</option>
                            ) : categories.length === 0 ? (
                              <option value="">Nicio categorie</option>
                            ) : (
                              categories.map((c) => (
                                <option key={String(c.id)} value={String(c.id)}>
                                  {c.name}
                                </option>
                              ))
                            )}
                          </select>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                        htmlFor="condition"
                      >
                        Stare *
                      </label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                        id="condition"
                        name="condition"
                        value={condition}
                        onChange={(e)=>setCondition(e.target.value)}
                      >
                        <option>Nou (Sigilat)</option>
                        <option>Nou (Desigilat)</option>
                        <option>Surplus Rămas</option>
                        <option>Defecte Minore</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                      htmlFor="description"
                    >
                      Descriere Tehnică
                    </label>
                    <textarea
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white font-mono text-sm"
                      id="description"
                      name="description"
                      placeholder="Listează specificații tehnice, numere de lot, condiții de stocare..."
                      rows={4}
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* Step 2 */}
              <section className="bg-white rounded-lg border border-border-color shadow-sm overflow-hidden">
                <div className="bg-neutral-light/50 px-6 py-4 border-b border-border-color flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-seller-primary text-white text-xs font-bold">
                      2
                    </span>
                    Logistică & Prețuri
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    PARTEA 02/03
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                        htmlFor="price"
                      >
                        Preț per Unitate (RON) *
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white pr-12"
                          id="price"
                          name="price"
                          placeholder="0.00"
                          type="number"
                          value={pricePerUnit}
                          onChange={(e) => setPricePerUnit(e.target.value)}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm font-bold">
                            RON
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                        htmlFor="unit"
                      >
                        Tip Unitate *
                      </label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                        id="unit"
                        name="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      >
                        <option value="pcs">Bucată (buc)</option>
                        <option value="m2">Metru Pătrat (m²)</option>
                        <option value="m3">Metru Cub (m³)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="pallet">Palet</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-6">
                      <input
                        className="h-4 w-4 rounded border-gray-300 text-seller-primary focus:ring-seller-primary"
                        id="vat"
                        name="vat"
                        type="checkbox"
                        checked={vatIncluded}
                        onChange={(e) => setVatIncluded(e.target.checked)}
                      />
                      <label
                        className="ml-2 block text-sm text-gray-700"
                        htmlFor="vat"
                      >
                        Prețul include TVA
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-yellow-50/50 p-4 rounded-md border border-yellow-100">
                    <div>
                      <label
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                        htmlFor="quantity"
                      >
                        Cantitate Totală Disponibilă *
                      </label>
                      <input
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                        id="quantity"
                        name="quantity"
                        placeholder="e.g. 500"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                        htmlFor="min_order"
                      >
                        Comandă Minimă
                      </label>
                      <input
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                        id="min_order"
                        name="min_order"
                        placeholder="e.g. 10"
                        type="number"
                        value={minOrder}
                        onChange={(e) => setMinOrder(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Step 3 */}
              <section className="bg-white rounded-lg border border-border-color shadow-sm overflow-hidden">
                <div className="bg-neutral-light/50 px-6 py-4 border-b border-border-color flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-seller-primary text-white text-xs font-bold">
                      3
                    </span>
                    Fotografii & Locație
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    PARTEA 03/03
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Imagini Produs
                    </label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 bg-gray-50 hover:bg-white hover:border-seller-primary transition-colors cursor-pointer">
                      <div className="space-y-1 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-400">
                          cloud_upload
                        </span>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            className="relative cursor-pointer rounded-md bg-transparent font-medium text-seller-primary hover:text-seller-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-seller-primary focus-within:ring-offset-2"
                            htmlFor="file-upload"
                          >
                            <span>Încarcă un fișier</span>
                            <input
                              className="sr-only"
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              multiple
                              onChange={(e) => onPickFiles(Array.from(e.target.files ?? []))}
                            />
                  {uploads.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {uploads.map((u) => (
                        <div
                          key={u.id}
                          className="relative rounded-md overflow-hidden border border-gray-200 bg-white"
                        >
                          <div
                            className="aspect-square bg-cover bg-center"
                            style={{ backgroundImage: `url("${u.previewUrl}")` }}
                          />
                          <div className="p-2 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-gray-500 truncate">
                              {u.uploading ? "Se încarcă…" : u.error ? "Eroare" : "Încărcat"}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeUpload(u.id)}
                              className="text-[11px] font-bold text-red-600 hover:underline"
                            >
                              Șterge
                            </button>
                          </div>
                          {u.error && (
                            <div className="px-2 pb-2 text-[11px] text-red-600">
                              {u.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                          </label>
                          <p className="pl-1">sau trage și plasează</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF până la 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">
                      Adresă Ridicare
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label
                          className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                          htmlFor="address"
                        >
                          Adresă Depozit *
                        </label>
                        <input
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                          id="address"
                          name="address"
                          placeholder="Adresă Stradă"
                          type="text"
                          value={pickupAddress}
                          onChange={(e)=>setPickupAddress(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                          htmlFor="county"
                        >
                          Județ
                        </label>
                        <input
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                          id="county"
                          name="county"
                          placeholder="ex. Ilfov"
                          type="text"
                          value={pickupCounty}
                          onChange={(e)=>setPickupCounty(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                          htmlFor="city"
                        >
                          Oraș *
                        </label>
                        <input
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                          id="city"
                          name="city"
                          placeholder="București"
                          type="text"
                          value={pickupCity}
                          onChange={(e)=>setPickupCity(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                          htmlFor="postal"
                        >
                          Cod Poștal
                        </label>
                        <input
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-seller-primary focus:ring-seller-primary sm:text-sm py-2.5 bg-white"
                          id="postal"
                          name="postal"
                          type="text"
                          value={pickupPostal}
                          onChange={(e)=>setPickupPostal(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {uploadErrors.length > 0 && (
                <div className="p-3 rounded-md border border-amber-200 bg-amber-50 text-sm text-amber-800">
                  <div className="font-bold">Unele poze nu s-au încărcat</div>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {uploadErrors.slice(0, 5).map((u) => (
                      <li key={u.id} className="font-mono text-[12px]">
                        {u.file.name}: {u.error}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-[12px] text-amber-900/80">
                    Deschide DevTools → Console și caută logs cu prefixul <span className="font-mono">[list-item]</span>.
                  </div>
                </div>
              )}
              {submitError && (
                <div className="p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
                  {submitError}
                </div>
              )}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  className="text-sm font-bold text-gray-600 hover:text-gray-900"
                  type="button"
                >
                  Anulează
                </button>
                <button
                  className="w-full sm:w-auto px-8 py-3 bg-seller-primary text-white text-base font-bold rounded-lg hover:bg-seller-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  type="submit"
                  disabled={submitting || uploadingAny}
                >
                  <span>{submitting ? "Se salvează…" : uploadingAny ? "Se încarcă pozele…" : "Publică Listarea"}</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* right column unchanged */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-border-color shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 text-green-700 rounded-full">
                  <span className="material-symbols-outlined text-xl">
                    verified_user
                  </span>
                </div>
                <h4 className="font-bold text-sm text-gray-900">
                  Verificare Vânzător
                </h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Contul tău <strong>Construct S.R.L.</strong> este verificat
                complet. Listările tale vor primi automat insigna "Vânzător de
                Încredere".
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">
                Status: Activ
              </span>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-blue-600">
                  receipt_long
                </span>
                <h4 className="font-bold text-sm text-blue-900">
                  Cerințe Facturare
                </h4>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Deoarece listezi ca distribuitor B2B, trebuie să poți oferi
                factură fiscală pentru toate vânzările ce depășesc 500 RON.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-border-color shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 mb-3">
                Ai nevoie de ajutor?
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-seller-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      book
                    </span>
                    Ghidul Vânzătorului
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-seller-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      photo_camera
                    </span>
                    Sfaturi pentru poze mai bune
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-seller-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      support_agent
                    </span>
                    Contactează Suportul
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#f0f2f4] py-12 mt-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                MatPort Centrul Vânzătorilor
              </span>
            </div>
            <p className="text-sm text-[#617289]">© 2023 MatPort România.</p>
            <div className="flex gap-4">
              <a className="text-[#617289] hover:text-seller-primary" href="#">
                Termeni
              </a>
              <a className="text-[#617289] hover:text-seller-primary" href="#">
                Confidențialitate
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerListing;
