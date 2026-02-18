import React from 'react';
import Link from 'next/link';

const SearchResults: React.FC = () => {
  return (
    <div className="bg-background-light text-[#111418] font-display antialiased overflow-x-hidden flex flex-col min-h-screen">


      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 h-fit sticky top-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg">Filtre</h2>
            <button className="text-sm text-primary font-medium hover:underline">Resetează</button>
          </div>
          <div className="flex flex-col gap-6">
            <div className="pb-6 border-b border-[#f0f2f4]">
              <h3 className="font-bold text-sm mb-3 text-[#111418]">Categorie</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-[#111418]">Materiale de Construcții</span>
                  <span className="text-xs text-gray-500 ml-auto">(128)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-[#111418]">Finisaje</span>
                  <span className="text-xs text-gray-500 ml-auto">(45)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-[#111418]">Electrice</span>
                  <span className="text-xs text-gray-500 ml-auto">(22)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-[#111418]">Sanitare</span>
                  <span className="text-xs text-gray-500 ml-auto">(34)</span>
                </label>
              </div>
            </div>
            <div className="pb-6 border-b border-[#f0f2f4]">
              <h3 className="font-bold text-sm mb-3 text-[#111418]">Interval Preț (RON)</h3>
              <div className="flex items-center gap-2 mb-4">
                <input className="w-full text-sm p-2 rounded border border-gray-300 focus:border-primary focus:ring-primary" placeholder="Min" type="number"/>
                <span className="text-gray-400">-</span>
                <input className="w-full text-sm p-2 rounded border border-gray-300 focus:border-primary focus:ring-primary" placeholder="Max" type="number"/>
              </div>
              <input className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" type="range"/>
            </div>
            <div className="pb-6 border-b border-[#f0f2f4]">
              <h3 className="font-bold text-sm mb-3 text-[#111418]">Stare</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-[#111418]">Nou (Surplus)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-[#111418]">Desigilat</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox"/>
                  <span className="text-sm text-[#111418]">Utilizat (Bun)</span>
                </label>
              </div>
            </div>
            <div className="pb-6 border-b border-[#f0f2f4]">
              <h3 className="font-bold text-sm mb-3 text-[#111418]">Locație</h3>
              <div className="relative mb-3">
                <span className="absolute left-2.5 top-2.5 material-symbols-outlined text-gray-400 text-sm">location_on</span>
                <input className="w-full text-sm pl-8 p-2 rounded border border-gray-300 focus:border-primary focus:ring-primary" placeholder="Oraș sau Regiune" type="text"/>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input defaultChecked className="text-primary focus:ring-primary" name="distance" type="radio"/>
                  <span className="text-sm text-[#111418]">Oriunde</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="text-primary focus:ring-primary" name="distance" type="radio"/>
                  <span className="text-sm text-[#111418]">La max 50 km</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="text-primary focus:ring-primary" name="distance" type="radio"/>
                  <span className="text-sm text-[#111418]">La max 10 km</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-3 text-[#111418]">Cantitate Minimă</h3>
              <select className="w-full text-sm p-2 rounded border border-gray-300 focus:border-primary focus:ring-primary">
                <option>Orice cantitate</option>
                <option>Vrac (Palet+)</option>
                <option>Loturi mici</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#111418]">Materiale de Construcții</h1>
              <p className="text-sm text-[#617289] mt-1">Se afișează 1-12 din 128 rezultate</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#111418] whitespace-nowrap">Sortează după:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-[#e5e7eb] text-[#111418] text-sm font-medium py-2 pl-3 pr-8 rounded-lg focus:ring-primary focus:border-primary cursor-pointer hover:bg-gray-50">
                  <option>Relevanță</option>
                  <option>Preț: Crescător</option>
                  <option>Preț: Descrescător</option>
                  <option>Cele mai noi</option>
                  <option>Distanță: Cel mai apropiat</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#617289]">
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>
              <button className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[#e5e7eb] rounded-lg bg-white text-sm font-medium hover:bg-gray-50">
                <span className="material-symbols-outlined text-lg">tune</span>
                Filtre
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1 bg-[#f0f2f4] px-3 py-1 rounded-full text-xs font-medium text-[#111418]">
              Ciment
              <button className="hover:text-red-500"><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
            <div className="flex items-center gap-1 bg-[#f0f2f4] px-3 py-1 rounded-full text-xs font-medium text-[#111418]">
              București (+50km)
              <button className="hover:text-red-500"><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
            <div className="flex items-center gap-1 bg-[#f0f2f4] px-3 py-1 rounded-full text-xs font-medium text-[#111418]">
              Preț: 100 - 5000 RON
              <button className="hover:text-red-500"><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
            <button className="text-xs text-primary font-bold hover:underline ml-2">Clear All</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">-35%</div>
                <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg block">favorite</span>
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDeZNX_BkJmCLTevYKZwEfhz_RsYlWJdveFzuDRIoZrrmZaffZgx28_GmDLorRwvwkptimWzHW88U4olPxGXynCQemXK___YVMF6a0tLZuw7FJ-V8Obnv6boOCMzQ9cpKesA1OcbdJJ95X2jpfB1bVSPz7GRVjN2nw6spR1w8f2bb0UhaNBWzUCvSTmQEJbqLpvSdDIxqU4exbkaIKVbICbQOMu7Hl8CZDxzPK1U7zh1QFw6Lacjqbu7Sr9btdpaObLxsAHcGlZz--u")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Țiglă Ceramică (Palet)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">850 RON</span>
                  <span className="text-sm text-[#617289] line-through decoration-red-500">1,300 RON</span>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-[#617289]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> București, Sector 3
                  </div>
                  <span>acum 2 zile</span>
                </div>
              </div>
            </Link>
            
            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-10">Vrac</div>
                <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg block">favorite</span>
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCz6X3wuXrueO0ZHGqpiqHFeOo6CaGZH2SePIElCPK3wdhNyHIlLD0Hn8a7ZzZvZmdwevlhH8LQVHjqg3kKQLVDcXEbBypmvxH7jkVe5sGk-inGf9mM4VNvhjoNjcF27x0QnZfJyUj0q4mzu5HBgM3k1VlulVUfGLMsyarY6em7Lo-lNtw44UhvU7aIkl2EqbbUFGu9vdh7qeB91k5H72-E4_1jAmyGHlFqBPkIGZhR4QYjOWaq7MhKZzQC7pnMmg4PVbdWDGWn-7y3")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Parchet Stejar (50m²)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">2,100 RON</span>
                  <span className="text-sm text-[#617289]">42 RON / m²</span>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-[#617289]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Cluj-Napoca
                  </div>
                  <span>acum 5 ore</span>
                </div>
              </div>
            </Link>

            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">-50%</div>
                <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg block">favorite</span>
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1D8fgZX5Sj4u86miYNIptkW3qYTquD_YJx3wyIaaBKfHYM4qGdk9ZQRRikedly-KCLox_zE_CXROaBfKEGtY-dpfO8kX2kNGo6ghIgg3GaIsd_g9EC5Bjf7uLl8mB_ZC9OSD3V3kakmims3u1_7XB3A_P6WcqpROXHfVptlI6sXQgpdTcZZW0WoGllJ00z5sjO-vTOhwz6wvPUziK0Ztei0QbAGzE2Rb7nq1Y2mN4Sj2kpx_UyyCfLyefr-l4mT81FI4ls4F9qw2x")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Chiuvete Baie Premium (Lot de 5)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">1,200 RON</span>
                  <span className="text-sm text-[#617289] line-through decoration-red-500">2,400 RON</span>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-[#617289]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Timișoara
                  </div>
                  <span>acum 1 săptămână</span>
                </div>
              </div>
            </Link>

            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded z-10">New Arrival</div>
                <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg block">favorite</span>
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Role Vată de Sticlă</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">120 RON</span>
                  <span className="text-sm text-[#617289]">per rolă</span>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-[#617289]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Constanța
                  </div>
                  <span>chiar acum</span>
                </div>
              </div>
            </Link>

            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">-20%</div>
                <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg block">favorite</span>
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9T1saUzj1ZAx6WnqG5f-IFOce4dCH6g9eTLJfFPxyNWnN-9nrcvLsxXKE9PAEf9IFdztClLSnsHxyJRoJ4GTgiYTbvFMOC4oWTORPDfD6snFtxAFFrQY0z24JMqhP60vKJxHAxikyfrDfZI_LbcRPAFrwumPLmrAezKZ-SIYStMSUPKFlztYR1cst27g4Ptxz1domsUmwFzAHBZIQOHJHQCp7Pgc1Rf6ar2GZ9V5IN5cQhJDXyF4sJDh-_jbZtBSKSKg10vyioiPj")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Ciment Portland (40 Saci)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">950 RON</span>
                  <span className="text-sm text-[#617289] line-through decoration-red-500">1,200 RON</span>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-[#617289]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Iași
                  </div>
                  <span>acum 3 zile</span>
                </div>
              </div>
            </Link>

            <Link href="/product" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded z-10">Ultimele 2</div>
                <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg block">favorite</span>
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAuSCvXwxG2k7vrRBDct7x5U8YsV-VxmLlHDK4QwS4aeiv3H3-leLIPdD2VdRIuWaVsV8ztCZ8aX-lPsl_inqjYJCVmTJtjUQEDXYl66r0BgFY8lzDgINdF02-dxcBbW3mv2RMmpt-xNDMpRurwx9Ow6sghHM2gDOYQT7oKsTIDGaUXhmq7wtGXaG0lmzs_qYQjCb5f8K3Ijv3mcZtUv20E-veO9llz1TFgBgyCa0Me10Ttr-6PK9HKMmznv6Un4Gh8AyrMYuXfkV8")'}}></div>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#111418] text-lg leading-tight group-hover:text-primary transition-colors">Set Bormașină Profesională (DeWalt)</h3>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-primary">800 RON</span>
                  <span className="text-sm text-[#617289]">Retail: 1100 RON</span>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-[#617289]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Brașov
                  </div>
                  <span>acum 1 oră</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="p-2 border border-[#e5e7eb] rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#111418] font-medium transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#111418] font-medium transition-colors">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-[#617289]">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#111418] font-medium transition-colors">12</button>
              <button className="p-2 border border-[#e5e7eb] rounded-lg hover:bg-gray-50">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </main>

    </div>
  );
};

export default SearchResults;