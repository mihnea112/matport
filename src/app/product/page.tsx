import React from 'react';
import Link from 'next/link';

const ProductDetail: React.FC = () => {
  return (
    <div className="bg-background-light text-[#111418] font-display antialiased overflow-x-hidden flex flex-col min-h-screen">
      
      <main className="flex-grow">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 py-4">
          <nav className="flex text-sm text-[#617289]">
            <Link href="/" className="hover:text-primary transition-colors">Acasă</Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-primary transition-colors">Materiale Acoperiș</Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-primary transition-colors">Țiglă Ceramică</Link>
            <span className="mx-2">/</span>
            <span className="text-[#111418] font-medium truncate">Țiglă Ceramică Premium - Argilă Roșie</span>
          </nav>
        </div>

        <section className="pb-12 pt-2">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-light border border-[#e5e7eb] relative group">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide">-35% Lichidare</span>
                    <span className="bg-white/90 backdrop-blur text-[#111418] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span> Stoc Verificat
                    </span>
                  </div>
                  <div className="w-full h-full bg-cover bg-center cursor-zoom-in group-hover:scale-105 transition-transform duration-500 ease-out" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDeZNX_BkJmCLTevYKZwEfhz_RsYlWJdveFzuDRIoZrrmZaffZgx28_GmDLorRwvwkptimWzHW88U4olPxGXynCQemXK___YVMF6a0tLZuw7FJ-V8Obnv6boOCMzQ9cpKesA1OcbdJJ95X2jpfB1bVSPz7GRVjN2nw6spR1w8f2bb0UhaNBWzUCvSTmQEJbqLpvSdDIxqU4exbkaIKVbICbQOMu7Hl8CZDxzPK1U7zh1QFw6Lacjqbu7Sr9btdpaObLxsAHcGlZz--u")'}}></div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <button className="aspect-square rounded-lg border-2 border-primary overflow-hidden relative">
                    <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDeZNX_BkJmCLTevYKZwEfhz_RsYlWJdveFzuDRIoZrrmZaffZgx28_GmDLorRwvwkptimWzHW88U4olPxGXynCQemXK___YVMF6a0tLZuw7FJ-V8Obnv6boOCMzQ9cpKesA1OcbdJJ95X2jpfB1bVSPz7GRVjN2nw6spR1w8f2bb0UhaNBWzUCvSTmQEJbqLpvSdDIxqU4exbkaIKVbICbQOMu7Hl8CZDxzPK1U7zh1QFw6Lacjqbu7Sr9btdpaObLxsAHcGlZz--u")'}}></div>
                  </button>
                  <button className="aspect-square rounded-lg border border-[#e5e7eb] overflow-hidden relative hover:border-primary/50 transition-colors">
                    <div className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9T1saUzj1ZAx6WnqG5f-IFOce4dCH6g9eTLJfFPxyNWnN-9nrcvLsxXKE9PAEf9IFdztClLSnsHxyJRoJ4GTgiYTbvFMOC4oWTORPDfD6snFtxAFFrQY0z24JMqhP60vKJxHAxikyfrDfZI_LbcRPAFrwumPLmrAezKZ-SIYStMSUPKFlztYR1cst27g4Ptxz1domsUmwFzAHBZIQOHJHQCp7Pgc1Rf6ar2GZ9V5IN5cQhJDXyF4sJDh-_jbZtBSKSKg10vyioiPj")'}}></div>
                  </button>
                  <button className="aspect-square rounded-lg border border-[#e5e7eb] overflow-hidden relative hover:border-primary/50 transition-colors">
                    <div className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAuSCvXwxG2k7vrRBDct7x5U8YsV-VxmLlHDK4QwS4aeiv3H3-leLIPdD2VdRIuWaVsV8ztCZ8aX-lPsl_inqjYJCVmTJtjUQEDXYl66r0BgFY8lzDgINdF02-dxcBbW3mv2RMmpt-xNDMpRurwx9Ow6sghHM2gDOYQT7oKsTIDGaUXhmq7wtGXaG0lmzs_qYQjCb5f8K3Ijv3mcZtUv20E-veO9llz1TFgBgyCa0Me10Ttr-6PK9HKMmznv6Un4Gh8AyrMYuXfkV8")'}}></div>
                  </button>
                  <button className="aspect-square rounded-lg border border-[#e5e7eb] bg-neutral-light flex items-center justify-center text-[#617289] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">play_circle</span>
                  </button>
                  <button className="aspect-square rounded-lg border border-[#e5e7eb] bg-neutral-light flex items-center justify-center text-[#617289] text-sm font-bold hover:bg-gray-100 transition-colors">
                    +4
                  </button>
                </div>

                <div className="hidden lg:block mt-8">
                  <h3 className="text-xl font-bold text-[#111418] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">straighten</span> Specificații Tehnice
                  </h3>
                  <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-[#e5e7eb]">
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289] w-1/3">Material</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">Ceramică (Argilă Naturală)</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 font-medium text-[#617289]">Dimensiuni</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">430 x 265 mm</td>
                        </tr>
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289]">Greutate / Bucată</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">3.1 kg</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 font-medium text-[#617289]">Calitate Material</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">Clasa A (Stoc Excedentar Proiect)</td>
                        </tr>
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289]">Acoperire</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">~12.5 buc / m²</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 font-medium text-[#617289]">Bucăți per Palet</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">240 buc</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-3">
                    <span className="material-symbols-outlined shrink-0">info</span>
                    <p>Acest lot este surplus de la un complex rezidențial din București. Materialele sunt păstrate în ambalajul original, neatinse.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="pb-6 border-b border-[#e5e7eb]">
                  <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-black text-[#111418] leading-tight">
                      Țiglă Ceramică Premium - Argilă Roșie (Palet Complet)
                    </h1>
                    <button className="p-2 rounded-full hover:bg-neutral-light text-[#617289] hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[#617289] text-sm">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span className="font-medium text-[#111418]">București, Sector 3</span> (Depozit Pantelimon)
                  </div>
                  <div className="mt-6 flex flex-wrap items-baseline gap-4">
                    <span className="text-4xl font-black text-primary">850 RON</span>
                    <div className="flex flex-col">
                      <span className="text-lg text-[#617289] line-through decoration-red-500 decoration-2">1,300 RON</span>
                      <span className="text-xs text-green-600 font-bold">Economisești 450 RON</span>
                    </div>
                    <span className="text-sm text-[#617289] ml-auto">Preț per palet (TVA inclus)</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600">inventory_2</span>
                    <div>
                      <p className="font-bold text-[#111418]">14 Paleți Disponibili</p>
                      <p className="text-xs text-[#617289]">Comandă min.: 1 palet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#617289]">Ultima actualizare</p>
                    <p className="text-xs font-bold text-[#111418]">acum 2 ore</p>
                  </div>
                </div>

                <div className="border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-neutral-light flex items-center justify-center text-[#111418] font-bold border border-[#e5e7eb]">
                      CD
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#111418]">Construct Depozit SRL</h3>
                        <span className="material-symbols-outlined text-primary text-lg" title="Afacere Verificată">verified</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#617289] mt-0.5">
                        <span className="font-bold text-[#111418]">4.9</span>
                        <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                        <span>(124 recenzii)</span>
                      </div>
                      <div className="mt-3 flex gap-4 text-xs">
                        <div className="flex items-center gap-1 text-[#617289]">
                          <span className="material-symbols-outlined text-sm">schedule</span> Răspunde în 1h
                        </div>
                        <div className="flex items-center gap-1 text-[#617289]">
                          <span className="material-symbols-outlined text-sm">calendar_month</span> Membru din 2021
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2">
                    <span>Cumpără Acum</span>
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                  <button className="w-full bg-white hover:bg-neutral-light text-[#111418] border-2 border-[#e5e7eb] font-bold text-lg py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">chat</span>
                    <span>Contactează Vânzătorul</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#617289]"><span className="material-symbols-outlined">local_shipping</span></div>
                    <div>
                      <h4 className="font-bold text-[#111418] text-sm">Opțiuni Livrare</h4>
                      <p className="text-sm text-[#617289]">Vânzătorul organizează transportul (aprox. 200 RON în București)</p>
                      <p className="text-sm text-[#617289]">Ridicare gratuită din Sector 3.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#617289]"><span className="material-symbols-outlined">security</span></div>
                    <div>
                      <h4 className="font-bold text-[#111418] text-sm">Garanția MatPort</h4>
                      <p className="text-sm text-[#617289]">Banii sunt păstrați în escrow până inspectezi marfa.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="font-bold text-[#111418] text-sm mb-2">Harta Locației</h4>
                  <div className="w-full h-48 bg-neutral-light rounded-xl border border-[#e5e7eb] relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'100%25\\' height=\\'100%25\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23e5e7eb\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%239ca3af\\'%3EMap View%3C/text%3E%3C/svg%3E')"}}>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-red-600 text-4xl drop-shadow-md">location_on</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded shadow font-medium">
                      Deschide în Hărți
                    </div>
                  </div>
                </div>

                <div className="lg:hidden col-span-1 mt-6">
                  <h3 className="text-xl font-bold text-[#111418] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">straighten</span> Specificații Tehnice
                  </h3>
                  <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-[#e5e7eb]">
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289] w-1/3">Material</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">Ceramică (Argilă Naturală)</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 font-medium text-[#617289]">Dimensiuni</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">430 x 265 mm</td>
                        </tr>
                        <tr className="bg-neutral-light/50">
                          <th className="px-4 py-3 font-medium text-[#617289]">Greutate / Bucată</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">3.1 kg</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 font-medium text-[#617289]">Calitate</th>
                          <td className="px-4 py-3 font-medium text-[#111418]">Clasa A</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-neutral-light border-t border-[#e5e7eb] mt-auto">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
            <h2 className="text-xl md:text-2xl font-bold text-[#111418] mb-6">Produse similare în apropiere</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                  { title: "Parchet Stejar (50m²)", price: "2,100 RON", location: "Cluj-Napoca", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCz6X3wuXrueO0ZHGqpiqHFeOo6CaGZH2SePIElCPK3wdhNyHIlLD0Hn8a7ZzZvZmdwevlhH8LQVHjqg3kKQLVDcXEbBypmvxH7jkVe5sGk-inGf9mM4VNvhjoNjcF27x0QnZfJyUj0q4mzu5HBgM3k1VlulVUfGLMsyarY6em7Lo-lNtw44UhvU7aIkl2EqbbUFGu9vdh7qeB91k5H72-E4_1jAmyGHlFqBPkIGZhR4QYjOWaq7MhKZzQC7pnMmg4PVbdWDGWn-7y3" },
                  { title: "Vată de Sticlă", price: "120 RON", location: "Constanța", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY" },
                  { title: "Lot Cablu Cupru (Industrial)", price: "4,500 RON", location: "București", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgMhvUxa2er2x0snxjPsSQB4iNgvbI1RYy4hJKDM2nHibIWaKzjKPzGNiDkKJll7UWFuN0lyoWVEFO5SKbKfZPZI3excbIWC3b4oXkfxFbhnNiDoYgha50g72ZioxhI6_v-cywiEObigbZ40KVS4R0oCcHcyHLTuZoA_VERi8YUb4wUJ1fFoCw8gBg5zR_gKt6Rq5-Cktu87OqkzTMm93KrcDE1tMir-ReW5SJiNhkmbjIwvj3oBNu_T29WBHfm92W6wQ3f-OQKAzr" },
                  { title: "Asortiment Țevi PVC", price: "350 RON", location: "Ilfov", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm7WrnjOZiMkChz3auAQBRSSy8UcdR4QXsKTKy3LDpCBoHZXm9NzOPo1WepGuC2eSno4qJXMLGoxBb-alyRRLJ8dUn3e-vJ3bsNhWHq0TD7pjSSBTY0R8ckW2YjPGpQ65QHRso2C8Ef_noIX6QSznqAm4yR_0TVLFDc3jDvSwy0WuK2dNGos0gr20hjU-C7kIyEKzKio2pmY5-NOSp9PdgZ9y0k46uml4o1KfxmXsmpatBU4bKgo7UMFSGQrhsiYuvWHNApzmgnDqJ" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url("${item.img}")`}}></div>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-bold text-[#111418] text-base leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-black text-primary">{item.price}</span>
                    </div>
                    <div className="text-xs text-[#617289] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span> {item.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default ProductDetail;