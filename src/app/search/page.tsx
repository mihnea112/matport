import React from "react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type Category = { id: number; name: string; slug: string };

type Listing = {
  id: string;
  title: string;
  price_total: string | number;
  quantity: string | number;
  unit: string;
  currency: string;
  pickup_city: string | null;
  pickup_county: string | null;
  created_at: string;
  listing_images?: { storage_path: string | null; sort_order: number | null }[];
};

function pickOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

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
  const t = toNumber(total);
  const q = toNumber(qty);
  if (t === null || q === null || q <= 0) return null;
  return t / q;
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  if (!Number.isFinite(ms)) return "";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `acum ${Math.max(1, mins)} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `acum ${hrs} ore`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `acum ${days} zile`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `acum ${weeks} săptămâni`;
  return d.toLocaleDateString("ro-RO");
}

export default async function SearchResults({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};

  const q = (pickOne(sp.q) ?? "").toString().trim();
  const categorySlug = (pickOne(sp.category) ?? "").toString().trim();
  const city = (pickOne(sp.city) ?? "").toString().trim();
  const county = (pickOne(sp.county) ?? "").toString().trim();

  const minPrice = toNumber(pickOne(sp.minPrice));
  const maxPrice = toNumber(pickOne(sp.maxPrice));

  const sort = (pickOne(sp.sort) ?? "new").toString();

  const supabase = await supabaseServer();

  // Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name", { ascending: true });

  // Resolve category_id from slug
  let categoryId: number | null = null;
  if (categorySlug && Array.isArray(categories)) {
    const found = (categories as any[]).find(
      (c) => String(c.slug) === categorySlug,
    );
    if (found?.id != null) categoryId = Number(found.id);
  }

  let query = supabase
    .from("listings")
    .select(
      "id,title,price_total,quantity,unit,currency,pickup_city,pickup_county,created_at,listing_images(storage_path,sort_order)",
    )
    .eq("status", "active");

  if (categoryId !== null && Number.isFinite(categoryId)) {
    query = query.eq("category_id", categoryId);
  }

  if (q) {
    // simple ilike on title
    const s = q.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.ilike("title", `%${s}%`);
  }

  if (city) {
    const s = city.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.ilike("pickup_city", `%${s}%`);
  }

  if (county) {
    const s = county.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.ilike("pickup_county", `%${s}%`);
  }

  if (minPrice !== null) query = query.gte("price_total", minPrice);
  if (maxPrice !== null) query = query.lte("price_total", maxPrice);

  if (sort === "price_asc")
    query = query.order("price_total", { ascending: true });
  else if (sort === "price_desc")
    query = query.order("price_total", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  // MVP pagination
  const page = Math.max(1, Number(pickOne(sp.page) ?? 1) || 1);
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: listings, error } = await query.range(from, to);

  const getPublicImageUrl = (storagePath: string | null | undefined) => {
    if (!storagePath) return null;
    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(storagePath);
    return data?.publicUrl ?? null;
  };

  const fallbackImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY";

  const safeCategories: Category[] = Array.isArray(categories)
    ? (categories as any)
    : [];
  const safeListings: Listing[] = Array.isArray(listings)
    ? (listings as any)
    : [];

  const heading =
    safeCategories.find((c) => c.slug === categorySlug)?.name ||
    (q ? `Rezultate pentru "${q}"` : "Toate materialele");

  const activeFilterChips: { label: string; href: string }[] = [];
  const base = new URLSearchParams();
  if (q) base.set("q", q);

  if (categorySlug) {
    const p = new URLSearchParams(base);
    p.set("category", categorySlug);
    activeFilterChips.push({
      label: categorySlug,
      href: `/search?${p.toString()}`,
    });
  }
  if (city) {
    const p = new URLSearchParams(base);
    if (categorySlug) p.set("category", categorySlug);
    p.set("city", city);
    activeFilterChips.push({ label: city, href: `/search?${p.toString()}` });
  }
  if (county) {
    const p = new URLSearchParams(base);
    if (categorySlug) p.set("category", categorySlug);
    if (city) p.set("city", city);
    p.set("county", county);
    activeFilterChips.push({ label: county, href: `/search?${p.toString()}` });
  }
  if (minPrice !== null || maxPrice !== null) {
    const p = new URLSearchParams(base);
    if (categorySlug) p.set("category", categorySlug);
    if (city) p.set("city", city);
    if (county) p.set("county", county);
    if (minPrice !== null) p.set("minPrice", String(minPrice));
    if (maxPrice !== null) p.set("maxPrice", String(maxPrice));
    activeFilterChips.push({
      label: `Preț: ${minPrice ?? "-"} - ${maxPrice ?? "-"} RON`,
      href: `/search?${p.toString()}`,
    });
  }

  return (
    <div className="bg-background-light text-[#111418] font-display antialiased overflow-x-hidden flex flex-col min-h-screen">
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 h-fit sticky top-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg">Filtre</h2>
            <Link
              className="text-sm text-primary font-medium hover:underline"
              href="/search"
            >
              Resetează
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            <div className="pb-6 border-b border-[#f0f2f4]">
              <h3 className="font-bold text-sm mb-3 text-[#111418]">
                Categorie
              </h3>
              <div className="space-y-2">
                {safeCategories.length === 0 ? (
                  <div className="text-sm text-[#617289]">Nicio categorie.</div>
                ) : (
                  safeCategories.map((c) => {
                    const href = `/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      category: c.slug,
                    }).toString()}`;
                    const active = c.slug === categorySlug;
                    return (
                      <Link
                        key={c.id}
                        href={href}
                        className={
                          active
                            ? "flex items-center gap-2 text-sm font-bold text-primary"
                            : "flex items-center gap-2 text-sm text-[#111418] hover:text-primary"
                        }
                      >
                        <span>{c.name}</span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pb-6 border-b border-[#f0f2f4]">
              <h3 className="font-bold text-sm mb-3 text-[#111418]">
                Interval Preț (RON)
              </h3>

              <form method="GET" action="/search" className="space-y-3">
                {/* Preserve other filters */}
                {q && <input type="hidden" name="q" value={q} />}
                {categorySlug && (
                  <input type="hidden" name="category" value={categorySlug} />
                )}
                {city && <input type="hidden" name="city" value={city} />}
                {county && <input type="hidden" name="county" value={county} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
                <input type="hidden" name="page" value="1" />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#617289] uppercase tracking-wide mb-1">
                      Min
                    </label>
                    <input
                      name="minPrice"
                      defaultValue={minPrice ?? ""}
                      inputMode="numeric"
                      className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] bg-white text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#617289] uppercase tracking-wide mb-1">
                      Max
                    </label>
                    <input
                      name="maxPrice"
                      defaultValue={maxPrice ?? ""}
                      inputMode="numeric"
                      className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] bg-white text-sm"
                      placeholder="100000"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-md bg-primary text-white font-bold text-sm"
                >
                  Aplică
                </button>

                {(minPrice !== null || maxPrice !== null) && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(city ? { city } : {}),
                      ...(county ? { county } : {}),
                      ...(sort ? { sort } : {}),
                      page: "1",
                    }).toString()}`}
                    className="block text-center text-xs text-primary font-bold hover:underline"
                  >
                    Elimină filtrul de preț
                  </Link>
                )}
              </form>
            </div>

            <div className="pb-6 border-b border-[#f0f2f4]">
              <h3 className="font-bold text-sm mb-3 text-[#111418]">Locație</h3>

              <form method="GET" action="/search" className="space-y-3">
                {/* Preserve other filters */}
                {q && <input type="hidden" name="q" value={q} />}
                {categorySlug && (
                  <input type="hidden" name="category" value={categorySlug} />
                )}
                {minPrice !== null && (
                  <input type="hidden" name="minPrice" value={String(minPrice)} />
                )}
                {maxPrice !== null && (
                  <input type="hidden" name="maxPrice" value={String(maxPrice)} />
                )}
                {sort && <input type="hidden" name="sort" value={sort} />}
                <input type="hidden" name="page" value="1" />

                <div>
                  <label className="block text-[11px] font-bold text-[#617289] uppercase tracking-wide mb-1">
                    Oraș
                  </label>
                  <input
                    name="city"
                    defaultValue={city}
                    className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] bg-white text-sm"
                    placeholder="ex. București"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#617289] uppercase tracking-wide mb-1">
                    Județ
                  </label>
                  <input
                    name="county"
                    defaultValue={county}
                    className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] bg-white text-sm"
                    placeholder="ex. Ilfov"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-md bg-primary text-white font-bold text-sm"
                >
                  Aplică
                </button>

                {(city || county) && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(minPrice !== null ? { minPrice: String(minPrice) } : {}),
                      ...(maxPrice !== null ? { maxPrice: String(maxPrice) } : {}),
                      ...(sort ? { sort } : {}),
                      page: "1",
                    }).toString()}`}
                    className="block text-center text-xs text-primary font-bold hover:underline"
                  >
                    Elimină filtrul de locație
                  </Link>
                )}
              </form>
            </div>

          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#111418]">{heading}</h1>
              <p className="text-sm text-[#617289] mt-1">
                {error
                  ? "Eroare la încărcare."
                  : `Se afișează ${safeListings.length} rezultate (pagina ${page})`}
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-3 shadow-sm">
                <div className="text-xs font-bold text-[#617289] uppercase tracking-wide mb-2">
                  Sortare
                </div>

                <div className="flex flex-col gap-2 min-w-[220px]">
                  {[
                    { key: "new", label: "Cele mai noi" },
                    { key: "price_asc", label: "Preț: crescător" },
                    { key: "price_desc", label: "Preț: descrescător" },
                  ].map((s) => {
                    const href = `/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(city ? { city } : {}),
                      ...(county ? { county } : {}),
                      ...(minPrice !== null
                        ? { minPrice: String(minPrice) }
                        : {}),
                      ...(maxPrice !== null
                        ? { maxPrice: String(maxPrice) }
                        : {}),
                      sort: s.key,
                      page: "1",
                    }).toString()}`;

                    const active = sort === s.key;

                    return (
                      <Link
                        key={s.key}
                        href={href}
                        className={
                          active
                            ? "h-10 px-3 rounded-lg bg-primary text-white font-bold text-sm inline-flex items-center justify-between"
                            : "h-10 px-3 rounded-lg border border-[#e5e7eb] bg-white text-[#111418] font-bold text-sm inline-flex items-center justify-between hover:bg-gray-50"
                        }
                      >
                        <span>{s.label}</span>
                        <span className="material-symbols-outlined text-base">
                          {active ? "check" : "chevron_right"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilterChips.map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-1 bg-[#f0f2f4] px-3 py-1 rounded-full text-xs font-medium text-[#111418]"
                  title={chip.label}
                >
                  {chip.label}
                  <Link className="hover:text-red-500" href="/search">
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </Link>
                </div>
              ))}
              <Link
                className="text-xs text-primary font-bold hover:underline ml-2"
                href="/search"
              >
                Clear All
              </Link>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
              {error.message}
            </div>
          )}

          {safeListings.length === 0 ? (
            <div className="text-sm text-[#617289]">Niciun rezultat.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeListings.map((l) => {
                const imgs = Array.isArray(l.listing_images)
                  ? l.listing_images
                  : [];
                const firstPath = imgs
                  .slice()
                  .sort(
                    (a, b) =>
                      Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0),
                  )[0]?.storage_path;
                const imgUrl = getPublicImageUrl(firstPath) || fallbackImage;

                const loc =
                  [l.pickup_city, l.pickup_county].filter(Boolean).join(", ") ||
                  "România";

                return (
                  <Link
                    key={l.id}
                    href={`/product/${encodeURIComponent(String(l.id))}`}
                    className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(\"${imgUrl}\")` }}
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">
                          {l.title}
                        </h3>
                      </div>
                      {(() => {
                        const unitLabel = formatUnitLabel(String(l.unit ?? ""));
                        const unitPrice = computeUnitPrice(l.price_total, l.quantity);
                        const qtyNum = toNumber(l.quantity);

                        return (
                          <div className="flex flex-col gap-1 mt-1">
                            {unitPrice !== null ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-primary">
                                  {unitPrice.toLocaleString("ro-RO", {
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  {String(l.currency ?? "RON")}
                                </span>
                                <span className="text-sm text-[#617289] font-medium">
                                  / {unitLabel}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-black text-primary">
                                {formatMoney(l.price_total, l.currency)}
                              </span>
                            )}

                            {qtyNum !== null && qtyNum > 0 && (
                              <div className="text-xs text-[#617289]">
                                Cantitate disponibilă:{" "}
                                <span className="font-mono">{qtyNum}</span>{" "}
                                <span className="font-mono">{unitLabel}</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-[#617289]">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            location_on
                          </span>
                          {loc}
                        </div>
                        <span>{timeAgo(l.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <Link
                className={
                  page <= 1
                    ? "p-2 border border-[#e5e7eb] rounded-lg opacity-50 pointer-events-none"
                    : "p-2 border border-[#e5e7eb] rounded-lg hover:bg-gray-50"
                }
                href={`/search?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(city ? { city } : {}),
                  ...(county ? { county } : {}),
                  ...(minPrice !== null ? { minPrice: String(minPrice) } : {}),
                  ...(maxPrice !== null ? { maxPrice: String(maxPrice) } : {}),
                  ...(sort ? { sort } : {}),
                  page: String(Math.max(1, page - 1)),
                }).toString()}`}
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </Link>

              <span className="px-3 py-2 text-sm text-[#617289]">
                Pagina {page}
              </span>

              <Link
                className={
                  safeListings.length < pageSize
                    ? "p-2 border border-[#e5e7eb] rounded-lg opacity-50 pointer-events-none"
                    : "p-2 border border-[#e5e7eb] rounded-lg hover:bg-gray-50"
                }
                href={`/search?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(city ? { city } : {}),
                  ...(county ? { county } : {}),
                  ...(minPrice !== null ? { minPrice: String(minPrice) } : {}),
                  ...(maxPrice !== null ? { maxPrice: String(maxPrice) } : {}),
                  ...(sort ? { sort } : {}),
                  page: String(page + 1),
                }).toString()}`}
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
