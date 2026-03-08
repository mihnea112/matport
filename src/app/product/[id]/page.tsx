// File: src/app/product/[id]/page.tsx
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

function toNum(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function formatMoney(value: unknown, currency: unknown) {
  const n = toNum(value);
  const c = String(currency ?? "RON").trim() || "RON";
  if (n === null) return "Preț la cerere";
  return `${n.toLocaleString("ro-RO")} ${c}`;
}

function formatUnitLabel(unit: string) {
  const u = (unit || "").trim();
  if (!u) return "unit";
  if (u === "pcs") return "buc";
  if (u === "m2") return "m²";
  if (u === "m3") return "m³";
  if (u === "kg") return "kg";
  if (u === "pallet") return "palet";
  return u;
}

function computeUnitPrice(total: unknown, qty: unknown) {
  const t = toNum(total);
  const q = toNum(qty);
  if (t === null || q === null || q <= 0) return null;
  return t / q;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "MP";
  const a = parts[0]?.[0] ?? "M";
  const b = parts.length > 1 ? (parts[1]?.[0] ?? "P") : (parts[0]?.[1] ?? "P");
  return `${a}${b}`.toUpperCase();
}

export default async function ProductDetail({ params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  const supabase = await supabaseServer();

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      "id,title,description,status,category_id,quantity,unit,price_total,currency,pickup_city,pickup_county,created_at,listing_images(id,storage_path,sort_order),seller_company:companies(id,legal_name,display_name,cui,is_verified,city,county)",
    )
    .eq("id", id)
    .eq("status", "active")
    .limit(1)
    .then((res) => {
      const first = Array.isArray(res.data) ? res.data[0] : null;
      return { data: first as any, error: res.error };
    });

  if (error) {
    return (
      <div className="min-h-screen bg-background-light text-[#111418] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white border border-[#e5e7eb] rounded-xl p-6">
          <h1 className="text-xl font-black">Eroare</h1>
          <p className="text-sm text-[#617289] mt-2">{error.message}</p>
          <div className="mt-4">
            <Link href="/" className="text-primary font-bold hover:underline">
              Înapoi acasă
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) notFound();

  const imgs: any[] = Array.isArray(listing?.listing_images)
    ? listing.listing_images
    : [];
  const sortedImgs = imgs
    .slice()
    .sort((a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0));

  const getPublicImageUrl = (storagePath: string | null | undefined) => {
    if (!storagePath) return null;
    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(storagePath);
    return data?.publicUrl ?? null;
  };

  const fallbackImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY";

  const heroUrl =
    getPublicImageUrl(sortedImgs[0]?.storage_path) || fallbackImage;

  const currency = String(listing.currency ?? "RON").trim() || "RON";
  const qtyNum = toNum(listing.quantity);
  const unitLabel = formatUnitLabel(String(listing.unit ?? ""));
  const totalNum = toNum(listing.price_total);
  const unitPrice = computeUnitPrice(listing.price_total, listing.quantity);

  const unitPriceLabel =
    unitPrice !== null
      ? `${unitPrice.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} ${currency}`
      : null;

  const totalPriceLabel =
    totalNum !== null ? `${totalNum.toLocaleString("ro-RO")} ${currency}` : null;

  const city = String(listing.pickup_city ?? "").trim();
  const county = String(listing.pickup_county ?? "").trim();
  const location =
    city && county ? `${city}, ${county}` : city || county || "România";

  const company = listing.seller_company;
  const companyName =
    String(company?.display_name ?? "").trim() ||
    String(company?.legal_name ?? "").trim() ||
    "Vânzător";

  return (
    <div className="bg-background-light text-[#111418] font-display antialiased overflow-x-hidden flex flex-col min-h-screen w-full">
      <main className="flex-grow">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 py-4">
          <nav className="flex text-sm text-[#617289]">
            <Link href="/" className="hover:text-primary transition-colors">
              Acasă
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/search"
              className="hover:text-primary transition-colors"
            >
              Căutare
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#111418] font-medium truncate">
              {listing.title}
            </span>
          </nav>
        </div>

        <section className="pb-12 pt-2">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
                <div className="w-full rounded-xl overflow-hidden bg-neutral-light border border-[#e5e7eb] relative group min-h-[320px] md:min-h-[420px] lg:min-h-[520px]">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span
                      className={
                        company?.is_verified
                          ? "bg-white/90 backdrop-blur text-[#111418] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide flex items-center gap-1"
                          : "bg-white/90 backdrop-blur text-[#617289] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide flex items-center gap-1"
                      }
                    >
                      <span className="material-symbols-outlined text-sm">
                        {company?.is_verified ? "verified" : "help"}
                      </span>{" "}
                      {company?.is_verified ? "Vânzător Verificat" : "Vânzător Neverificat"}
                    </span>
                    {listing.status === "active" && (
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide">
                        Activ
                      </span>
                    )}
                  </div>

                  <div
                    className="absolute inset-0 bg-cover bg-center cursor-zoom-in group-hover:scale-105 transition-transform duration-500 ease-out"
                    style={{ backgroundImage: `url("${heroUrl}")` }}
                  />
                </div>

                {sortedImgs.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {sortedImgs.slice(0, 5).map((im: any, idx: number) => {
                      const url = getPublicImageUrl(im.storage_path) || heroUrl;
                      return (
                        <button
                          key={im.id ?? idx}
                          className={
                            idx === 0
                              ? "aspect-square rounded-lg border-2 border-primary overflow-hidden relative"
                              : "aspect-square rounded-lg border border-[#e5e7eb] overflow-hidden relative hover:border-primary/50 transition-colors"
                          }
                          type="button"
                        >
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url("${url}")` }}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="hidden lg:block mt-8">
                  <h3 className="text-xl font-bold text-[#111418] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">
                      straighten
                    </span>{" "}
                    Detalii
                  </h3>

                  <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-[#e5e7eb]">
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289] w-1/3">
                            Cantitate disponibilă
                          </th>
                          <td className="px-4 py-3 font-medium text-[#111418]">
                            {qtyNum !== null ? (
                              <span className="font-mono">
                                {qtyNum} {unitLabel}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 font-medium text-[#617289]">
                            Ridicare
                          </th>
                          <td className="px-4 py-3 font-medium text-[#111418]">
                            {location}
                          </td>
                        </tr>
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289]">
                            Preț / unitate
                          </th>
                          <td className="px-4 py-3 font-medium text-[#111418]">
                            {unitPriceLabel ? (
                              <div className="flex flex-col">
                                <span className="text-primary font-black">
                                  {unitPriceLabel} / {unitLabel}
                                </span>
                                {totalPriceLabel && (
                                  <span className="text-xs text-[#617289] font-normal mt-0.5">
                                    Total: {totalPriceLabel}
                                  </span>
                                )}
                              </div>
                            ) : totalPriceLabel ? (
                              <div className="flex flex-col">
                                <span className="text-primary font-black">
                                  {totalPriceLabel}
                                </span>
                                <span className="text-xs text-[#617289] font-normal mt-0.5">
                                  (nu se poate calcula prețul / unitate)
                                </span>
                              </div>
                            ) : (
                              "Preț la cerere"
                            )}
                          </td>
                        </tr>
                        {company?.cui && (
                          <tr>
                            <th className="px-4 py-3 font-medium text-[#617289]">
                              CUI vânzător
                            </th>
                            <td className="px-4 py-3 font-medium text-[#111418] font-mono">
                              {company.cui}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {listing.description && (
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-3">
                      <span className="material-symbols-outlined shrink-0">
                        info
                      </span>
                      <p className="whitespace-pre-wrap">
                        {listing.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6 min-w-0">
                <div className="pb-6 border-b border-[#e5e7eb]">
                  <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-black text-[#111418] leading-tight">
                      {listing.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[#617289] text-sm">
                    <span className="material-symbols-outlined text-lg">
                      location_on
                    </span>
                    <span className="font-medium text-[#111418]">
                      {location}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-col gap-1">
                    {unitPriceLabel ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-primary">
                          {unitPriceLabel}
                        </span>
                        <span className="text-base text-[#617289] font-medium">
                          / {unitLabel}
                        </span>
                      </div>
                    ) : totalPriceLabel ? (
                      <span className="text-4xl font-black text-primary">
                        {totalPriceLabel}
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-[#617289]">
                        Preț la cerere
                      </span>
                    )}

                    {totalPriceLabel && unitPriceLabel && (
                      <div className="text-sm text-[#617289]">Total: {totalPriceLabel}</div>
                    )}

                    {qtyNum !== null && (
                      <div className="text-sm text-[#617289]">
                        Cantitate disponibilă: <span className="font-mono">{qtyNum}</span>{" "}
                        <span className="font-mono">{unitLabel}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600">
                      inventory_2
                    </span>
                    <div>
                      <p className="font-bold text-[#111418]">Disponibil</p>
                      <p className="text-xs text-[#617289]">
                        Cantitate: {qtyNum !== null ? (
                          <span className="font-mono">{qtyNum} {unitLabel}</span>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#617289]">Publicat</p>
                    <p className="text-xs font-bold text-[#111418]">
                      {listing.created_at
                        ? new Date(listing.created_at).toLocaleDateString(
                            "ro-RO",
                          )
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-neutral-light flex items-center justify-center text-[#111418] font-bold border border-[#e5e7eb]">
                      {initials(companyName)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#111418]">
                          {companyName}
                        </h3>
                        {company?.is_verified && (
                          <span
                            className="material-symbols-outlined text-primary text-lg"
                            title="Afacere Verificată"
                          >
                            verified
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-[#617289]">
                        {company?.city || company?.county ? (
                          <span>
                            {company.city || ""}
                            {company.county ? `, ${company.county}` : ""}
                          </span>
                        ) : (
                          <span>România</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs font-bold">
                        <span
                          className={
                            company?.is_verified
                              ? "text-green-700"
                              : "text-amber-700"
                          }
                        >
                          {company?.is_verified
                            ? "Status verificare: Verificat"
                            : "Status verificare: În așteptare"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                    type="button"
                  >
                    <span>Cumpără Acum</span>
                    <span className="material-symbols-outlined">
                      shopping_cart
                    </span>
                  </button>
                  <button
                    className="w-full bg-white hover:bg-neutral-light text-[#111418] border-2 border-[#e5e7eb] font-bold text-lg py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    type="button"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    <span>Contactează Vânzătorul</span>
                  </button>
                </div>

                <div className="lg:hidden col-span-1 mt-6">
                  <h3 className="text-xl font-bold text-[#111418] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">
                      straighten
                    </span>{" "}
                    Detalii
                  </h3>
                  <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-[#e5e7eb]">
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289] w-1/3">
                            Cantitate disponibilă
                          </th>
                          <td className="px-4 py-3 font-medium text-[#111418]">
                            {qtyNum !== null ? (
                              <span className="font-mono">{qtyNum} {unitLabel}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 font-medium text-[#617289]">
                            Ridicare
                          </th>
                          <td className="px-4 py-3 font-medium text-[#111418]">
                            {location}
                          </td>
                        </tr>
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289]">
                            Preț / unitate
                          </th>
                          <td className="px-4 py-3 font-medium text-[#111418]">
                            {unitPriceLabel ? (
                              <span className="text-primary font-black">
                                {unitPriceLabel} / {unitLabel}
                              </span>
                            ) : totalPriceLabel ? (
                              <span className="text-primary font-black">{totalPriceLabel}</span>
                            ) : (
                              "Preț la cerere"
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {listing.description && (
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-3">
                      <span className="material-symbols-outlined shrink-0">
                        info
                      </span>
                      <p className="whitespace-pre-wrap">
                        {listing.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-neutral-light border-t border-[#e5e7eb] mt-auto">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
            <h2 className="text-xl md:text-2xl font-bold text-[#111418] mb-6">
              Produse similare în apropiere
            </h2>
            <p className="text-sm text-[#617289]">
              (MVP) Vom adăuga recomandări reale mai târziu.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
