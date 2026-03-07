import React from "react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

const Home = async () => {
  const supabase = await supabaseServer();

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,slug,image_path")
    .order("name", { ascending: true });

  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id,title,price_total,currency,pickup_city,pickup_county,created_at, listing_images(storage_path,sort_order)",
    )
    .order("created_at", { ascending: false })
    .limit(4);

  const getPublicImageUrl = (storagePath: string | null | undefined) => {
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

  const getPublicCategoryImageUrl = (storagePath: string | null | undefined) => {
    if (!storagePath) return null;
    try {
      const { data } = supabase.storage
        .from("category-images")
        .getPublicUrl(storagePath);
      return data?.publicUrl ?? null;
    } catch {
      return null;
    }
  };

  const fallbackImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY";

  return (
    <div className="bg-background-light text-[#111418] font-display antialiased overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-background-light">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-10">
          <div
            className="relative overflow-hidden rounded-2xl min-h-[480px] flex flex-col justify-center items-start p-6 md:p-12 lg:p-16 bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfGJg6WlQYZCb_fFdCLHhcm_fgzFBzoqO90fRB8bfXSy_8A49pxfZp1bPselrezqOJ69PmxXV9wgrUJ_W80MlfMgeq8cQX4DpESI9_7HfJuSqw0CaNVCL6vE7FGWoQQvKyy3OfzGvCVfGn0egkttedORbJXMdUauVbT_IaNaKqodLGWbX3POmLgMkYOI8iJQ8DYjQ2vaJfgnQtYMMerxMBcniEDmQLyOex6Zf5w_Kp8M689mUhx_tA2pLwGAoGFp7lv2V9PPzZ5kqq")',
            }}
          >
            <div className="relative z-10 max-w-2xl flex flex-col gap-6">
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Cumpără materiale de construcții la prețuri de lichidare
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-normal max-w-lg leading-relaxed">
                Stocuri excedentare de la distribuitori de top din România. Fără
                intermediari. 100% Transparent.
              </p>
              <div className="flex flex-col sm:flex-row w-full max-w-[560px] bg-white rounded-lg p-1.5 gap-2 mt-4 shadow-xl">
                <div className="flex items-center flex-1 px-3 h-12 bg-transparent">
                  <span className="material-symbols-outlined text-[#617289] mr-3">
                    search
                  </span>
                  <input
                    className="w-full h-full border-none p-0 text-base text-[#111418] placeholder:text-[#617289] focus:ring-0"
                    placeholder="Ce construiești astăzi?"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Link
                    href="/search"
                    className="w-full sm:w-auto h-12 px-6 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Găsește Oferte</span>
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-white/80 text-sm font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    check_circle
                  </span>{" "}
                  Vânzători Verificați
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    shield
                  </span>{" "}
                  Protecție Escrow
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-neutral-light border-y border-[#e5e7eb]">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-10 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h4 className="font-bold text-[#111418]">
                  Vânzători Verificați
                </h4>
                <p className="text-sm text-[#617289]">
                  Profesioniști verificați
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined">savings</span>
              </div>
              <div>
                <h4 className="font-bold text-[#111418]">Prețuri de en-gros</h4>
                <p className="text-sm text-[#617289]">Până la 40% reducere</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div>
                <h4 className="font-bold text-[#111418]">Plăți Securizate</h4>
                <p className="text-sm text-[#617289]">
                  Fonduri păstrate în siguranță
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <h4 className="font-bold text-[#111418]">Suport</h4>
                <p className="text-sm text-[#617289]">Mediere disponibilă</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111418]">
              Cumpără după Categorie
            </h2>
            <Link
              href="/search"
              className="text-primary font-bold hover:underline flex items-center gap-1"
            >
              Vezi Tot{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories ?? []).map((cat: any) => {
              const img =
                getPublicCategoryImageUrl(cat.image_path) ??
                fallbackImage;
              return (
                <Link
                  key={cat.id}
                  href={`/search?category=${encodeURIComponent(cat.slug)}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="aspect-square bg-neutral-light rounded-xl overflow-hidden relative">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url("${img}")` }}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111418] text-lg">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-[#617289]">Vezi oferte</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-12 bg-neutral-light border-y border-[#e5e7eb]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111418]">
                Lichidări de stoc recente
              </h2>
              <p className="text-[#617289] mt-1">
                Surplusuri adăugate recent de la distribuitori
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(listings ?? []).map((l: any) => {
              const imgs: any[] = Array.isArray(l?.listing_images)
                ? l.listing_images
                : [];
              const sortedImgs = imgs
                .slice()
                .sort(
                  (a, b) =>
                    Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0),
                );

              const firstPath = sortedImgs[0]?.storage_path ?? null;
              const imgUrl = getPublicImageUrl(firstPath) || fallbackImage;

              const title = String(l?.title ?? "Listare");
              const city = String(l?.pickup_city ?? "");
              const county = String(l?.pickup_county ?? "");

              const rawPrice = l?.price_total;
              const price =
                typeof rawPrice === "number" ? rawPrice : Number(rawPrice);
              const hasPrice = Number.isFinite(price);

              const currency = String(l?.currency ?? "RON").trim() || "RON";

              return (
                <Link
                  key={String(l.id)}
                  href={`/product/${encodeURIComponent(String(l.id))}`}
                  className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${imgUrl}")` }}
                    ></div>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      {hasPrice ? (
                        <span className="text-xl font-black text-primary">
                          {price.toLocaleString("ro-RO")} {currency}
                        </span>
                      ) : (
                        <span className="text-sm text-[#617289]">
                          Preț la cerere
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#617289] flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      {city && county
                        ? `${city}, ${county}`
                        : city || county || "România"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why MatPort */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="flex flex-col gap-6 lg:w-1/3">
              <h2 className="text-3xl md:text-4xl font-black text-[#111418] leading-tight">
                De ce să cumperi de pe MatPort?
              </h2>
              <p className="text-lg text-[#617289] leading-relaxed">
                Conectăm proprietarii de case direct cu distribuitorii care au
                nevoie să elibereze spațiul din depozit. Primești materiale
                profesionale la o fracțiune din preț.
              </p>
              <button className="w-fit mt-2 px-6 py-3 bg-white border-2 border-[#111418] text-[#111418] font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Vezi cum funcționează
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:w-2/3">
              <div className="flex flex-col gap-4 p-6 bg-neutral-light rounded-xl">
                <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">
                    factory
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111418] mb-2">
                    Direct de la Sursă
                  </h3>
                  <p className="text-[#617289]">
                    Parteneriem cu distribuitori certificați pentru a vinde
                    stocul excedentar direct ție.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-neutral-light rounded-xl">
                <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">
                    local_offer
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111418] mb-2">
                    Prețuri Imbatabile
                  </h3>
                  <p className="text-[#617289]">
                    Economisește până la 40% față de magazinele de retail
                    cumpărând inventar surplus.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-neutral-light rounded-xl">
                <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">
                    verified_user
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111418] mb-2">
                    Sigur și Protejat
                  </h3>
                  <p className="text-[#617289]">
                    Plățile sunt păstrate în escrow până când verifici și
                    primești bunurile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
