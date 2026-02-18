import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

const Home = async () => {
  const supabase = await supabaseServer();

  const { data: categories } = await supabase
    .from('categories')
    .select('id,name,slug')
    .order('name', { ascending: true });

  const categoryImages: Record<string, string> = {
    ciment: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9T1saUzj1ZAx6WnqG5f-IFOce4dCH6g9eTLJfFPxyNWnN-9nrcvLsxXKE9PAEf9IFdztClLSnsHxyJRoJ4GTgiYTbvFMOC4oWTORPDfD6snFtxAFFrQY0z24JMqhP60vKJxHAxikyfrDfZI_LbcRPAFrwumPLmrAezKZ-SIYStMSUPKFlztYR1cst27g4Ptxz1domsUmwFzAHBZIQOHJHQCp7Pgc1Rf6ar2GZ9V5IN5cQhJDXyF4sJDh-_jbZtBSKSKg10vyioiPj",
    izolatii: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzjddX2eURtmWehvcMXS6zq9wC6R9AQhlRTjgxNwRshCuGiWRzJSTaekOuZbUyFBVRICoEvkkzrsX3Z8pd4rt1fPRCPJbSzMDPZKCsGI9VCsvifSqpkyCCZOwFeNuE-4BhNucyZmUf-lKSui2kmzO4xSn7ytjQmAbXLWDbnSA3_LEWvqqIBSvbsH1Q-TSDdqbmyK1ZLjSsW-0oLXu860GvJmtUa7ZIoLY8hvy9IdE_obnWEx0akm39QXD9JoTh4ZEQ65BFGl3_IHOw",
    "gresie-faianta": "https://lh3.googleusercontent.com/aida-public/AB6AXuCxElmkVgNlfwT-7fAcoRkQN3XTHC6Wcxs_CF3jdrU-lMY_u0DIX1JL8bg-MPTYvvAytf17N7S84Fs0E7p9pPNQ89pM8vDdjelm8SNbtruPUA_OMH0llqVNG3xOU0mh1luO3QsOQAQgPFumIJYyoMTWa4WMsiNAretSrDKIeCEZkbePGFT_d3pSGaO9F0gKEtZ2ItKKbuk5wIAqGGHZVw--HUEtTwjcY7pZfY2K-GxSBCrNt66sWrbBwAO-F7jsS4EyMbZ6Pu1QUGem",
    electrice: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgMhvUxa2er2x0snxjPsSQB4iNgvbI1RYy4hJKDM2nHibIWaKzjKPzGNiDkKJll7UWFuN0lyoWVEFO5SKbKfZPZI3excbIWC3b4oXkfxFbhnNiDoYgha50g72ZioxhI6_v-cywiEObigbZ40KVS4R0oCcHcyHLTuZoA_VERi8YUb4wUJ1fFoCw8gBg5zR_gKt6Rq5-Cktu87OqkzTMm93KrcDE1tMir-ReW5SJiNhkmbjIwvj3oBNu_T29WBHfm92W6wQ3f-OQKAzr",
    sanitare: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm7WrnjOZiMkChz3auAQBRSSy8UcdR4QXsKTKy3LDpCBoHZXm9NzOPo1WepGuC2eSno4qJXMLGoxBb-alyRRLJ8dUn3e-vJ3bsNhWHq0TD7pjSSBTY0R8ckW2YjPGpQ65QHRso2C8Ef_noIX6QSznqAm4yR_0TVLFDc3jDvSwy0WuK2dNGos0gr20hjU-C7kIyEKzKio2pmY5-NOSp9PdgZ9y0k46uml4o1KfxmXsmpatBU4bKgo7UMFSGQrhsiYuvWHNApzmgnDqJ",
    unelte: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAuSCvXwxG2k7vrRBDct7x5U8YsV-VxmLlHDK4QwS4aeiv3H3-leLIPdD2VdRIuWaVsV8ztCZ8aX-lPsl_inqjYJCVmTJtjUQEDXYl66r0BgFY8lzDgINdF02-dxcBbW3mv2RMmpt-xNDMpRurwx9Ow6sghHM2gDOYQT7oKsTIDGaUXhmq7wtGXaG0lmzs_qYQjCb5f8K3Ijv3mcZtUv20E-veO9llz1TFgBgyCa0Me10Ttr-6PK9HKMmznv6Un4Gh8AyrMYuXfkV8",
  };

  const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY";

  return (
    <div className="bg-background-light text-[#111418] font-display antialiased overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-background-light">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-10">
          <div 
            className="relative overflow-hidden rounded-2xl min-h-[480px] flex flex-col justify-center items-start p-6 md:p-12 lg:p-16 bg-cover bg-center" 
            style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfGJg6WlQYZCb_fFdCLHhcm_fgzFBzoqO90fRB8bfXSy_8A49pxfZp1bPselrezqOJ69PmxXV9wgrUJ_W80MlfMgeq8cQX4DpESI9_7HfJuSqw0CaNVCL6vE7FGWoQQvKyy3OfzGvCVfGn0egkttedORbJXMdUauVbT_IaNaKqodLGWbX3POmLgMkYOI8iJQ8DYjQ2vaJfgnQtYMMerxMBcniEDmQLyOex6Zf5w_Kp8M689mUhx_tA2pLwGAoGFp7lv2V9PPzZ5kqq")'}}
          >
            <div className="relative z-10 max-w-2xl flex flex-col gap-6">
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Cumpără materiale de construcții la prețuri de lichidare
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-normal max-w-lg leading-relaxed">
                Stocuri excedentare de la distribuitori de top din România. Fără intermediari. 100% Transparent.
              </p>
              <div className="flex flex-col sm:flex-row w-full max-w-[560px] bg-white rounded-lg p-1.5 gap-2 mt-4 shadow-xl">
                <div className="flex items-center flex-1 px-3 h-12 bg-transparent">
                  <span className="material-symbols-outlined text-[#617289] mr-3">search</span>
                  <input className="w-full h-full border-none p-0 text-base text-[#111418] placeholder:text-[#617289] focus:ring-0" placeholder="Ce construiești astăzi?"/>
                </div>
                <div className="w-full sm:w-auto">
                  <Link href="/search" className="w-full sm:w-auto h-12 px-6 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <span>Găsește Oferte</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-white/80 text-sm font-medium">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">check_circle</span> Vânzători Verificați</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">shield</span> Protecție Escrow</span>
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
                <h4 className="font-bold text-[#111418]">Vânzători Verificați</h4>
                <p className="text-sm text-[#617289]">Profesioniști verificați</p>
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
                <p className="text-sm text-[#617289]">Fonduri păstrate în siguranță</p>
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111418]">Cumpără după Categorie</h2>
            <Link href="/search" className="text-primary font-bold hover:underline flex items-center gap-1">
              Vezi Tot <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories ?? []).map((cat) => {
              const img = categoryImages[cat.slug] ?? fallbackImage;
              return (
                <Link key={cat.id} href={`/search?category=${encodeURIComponent(cat.slug)}`} className="group flex flex-col gap-3">
                  <div className="aspect-square bg-neutral-light rounded-xl overflow-hidden relative">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url("${img}")` }}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111418] text-lg">{cat.name}</h3>
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
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111418]">Lichidări de stoc recente</h2>
              <p className="text-[#617289] mt-1">Surplusuri adăugate recent de la distribuitori din București</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-35%</div>
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDeZNX_BkJmCLTevYKZwEfhz_RsYlWJdveFzuDRIoZrrmZaffZgx28_GmDLorRwvwkptimWzHW88U4olPxGXynCQemXK___YVMF6a0tLZuw7FJ-V8Obnv6boOCMzQ9cpKesA1OcbdJJ95X2jpfB1bVSPz7GRVjN2nw6spR1w8f2bb0UhaNBWzUCvSTmQEJbqLpvSdDIxqU4exbkaIKVbICbQOMu7Hl8CZDxzPK1U7zh1QFw6Lacjqbu7Sr9btdpaObLxsAHcGlZz--u")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Țiglă Ceramică (Palet)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">850 RON</span>
                  <span className="text-sm text-[#617289] line-through decoration-red-500">1,300 RON</span>
                </div>
                <div className="text-xs text-[#617289] flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-sm">location_on</span> București, Sector 3
                </div>
              </div>
            </Link>

            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Vrac</div>
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCz6X3wuXrueO0ZHGqpiqHFeOo6CaGZH2SePIElCPK3wdhNyHIlLD0Hn8a7ZzZvZmdwevlhH8LQVHjqg3kKQLVDcXEbBypmvxH7jkVe5sGk-inGf9mM4VNvhjoNjcF27x0QnZfJyUj0q4mzu5HBgM3k1VlulVUfGLMsyarY6em7Lo-lNtw44UhvU7aIkl2EqbbUFGu9vdh7qeB91k5H72-E4_1jAmyGHlFqBPkIGZhR4QYjOWaq7MhKZzQC7pnMmg4PVbdWDGWn-7y3")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Parchet Stejar (50m²)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">2,100 RON</span>
                  <span className="text-sm text-[#617289]">42 RON / m²</span>
                </div>
                <div className="text-xs text-[#617289] flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-sm">location_on</span> Cluj-Napoca
                </div>
              </div>
            </Link>

            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-50%</div>
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1D8fgZX5Sj4u86miYNIptkW3qYTquD_YJx3wyIaaBKfHYM4qGdk9ZQRRikedly-KCLox_zE_CXROaBfKEGtY-dpfO8kX2kNGo6ghIgg3GaIsd_g9EC5Bjf7uLl8mB_ZC9OSD3V3kakmims3u1_7XB3A_P6WcqpROXHfVptlI6sXQgpdTcZZW0WoGllJ00z5sjO-vTOhwz6wvPUziK0Ztei0QbAGzE2Rb7nq1Y2mN4Sj2kpx_UyyCfLyefr-l4mT81FI4ls4F9qw2x")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Chiuvete Baie Premium (Lot de 5)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">1,200 RON</span>
                  <span className="text-sm text-[#617289] line-through decoration-red-500">2,400 RON</span>
                </div>
                <div className="text-xs text-[#617289] flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-sm">location_on</span> Timișoara
                </div>
              </div>
            </Link>

            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Role Vată de Sticlă</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">120 RON</span>
                  <span className="text-sm text-[#617289]">per rolă</span>
                </div>
                <div className="text-xs text-[#617289] flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-sm">location_on</span> Constanța
                </div>
              </div>
            </Link>
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
                Conectăm proprietarii de case direct cu distribuitorii care au nevoie să elibereze spațiul din depozit. Primești materiale profesionale la o fracțiune din preț.
              </p>
              <button className="w-fit mt-2 px-6 py-3 bg-white border-2 border-[#111418] text-[#111418] font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Vezi cum funcționează
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:w-2/3">
              <div className="flex flex-col gap-4 p-6 bg-neutral-light rounded-xl">
                <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">factory</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111418] mb-2">Direct de la Sursă</h3>
                  <p className="text-[#617289]">Parteneriem cu distribuitori certificați pentru a vinde stocul excedentar direct ție.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-neutral-light rounded-xl">
                <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">local_offer</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111418] mb-2">Prețuri Imbatabile</h3>
                  <p className="text-[#617289]">Economisește până la 40% față de magazinele de retail cumpărând inventar surplus.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-neutral-light rounded-xl">
                <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111418] mb-2">Sigur și Protejat</h3>
                  <p className="text-[#617289]">Plățile sunt păstrate în escrow până când verifici și primești bunurile.</p>
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