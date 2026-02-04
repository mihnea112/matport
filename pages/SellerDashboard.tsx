import React from 'react';
import { Link } from 'react-router-dom';

const SellerDashboard: React.FC = () => {
  return (
    <div className="bg-[#f8f9fa] text-text-main font-body antialiased h-screen overflow-hidden flex">
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col h-full shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-[#e2e8f0]">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <svg className="size-7" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
            </svg>
            <span className="font-display font-bold text-xl text-[#111418] tracking-tight">MatPort</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-primary/5 text-primary font-medium group">
            <span className="material-symbols-outlined material-symbols-filled">inventory_2</span>
            Listările Mele
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-muted hover:bg-gray-50 hover:text-text-main font-medium transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
            Achiziții
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-muted hover:bg-gray-50 hover:text-text-main font-medium transition-colors">
            <span className="material-symbols-outlined">mail</span>
            Mesaje
            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-muted hover:bg-gray-50 hover:text-text-main font-medium transition-colors">
            <span className="material-symbols-outlined">business</span>
            Profil Companie
          </a>
          <div className="my-4 border-t border-[#e2e8f0] mx-3"></div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-muted hover:bg-gray-50 hover:text-text-main font-medium transition-colors">
            <span className="material-symbols-outlined">settings</span>
            Setări
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-muted hover:bg-gray-50 hover:text-text-main font-medium transition-colors">
            <span className="material-symbols-outlined">help</span>
            Suport
          </a>
        </nav>
        <div className="p-4 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
              CD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main">Construct Depot SRL</span>
              <span className="text-xs text-text-muted">Cont Vânzător</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-text-muted hover:text-text-main">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden md:flex items-center text-sm text-text-muted">
              <span>Panou de control</span>
              <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
              <span className="text-text-main font-medium">Listările Mele</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
              <input className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-[#e2e8f0] rounded-md focus:ring-1 focus:ring-primary focus:border-primary w-64 placeholder:text-gray-400" placeholder="Caută inventar..." type="text"/>
            </div>
            <button className="relative p-2 text-text-muted hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-surface"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#111418]">Listările Mele</h1>
              <p className="text-sm text-text-muted mt-1">Gestionează inventarul, prețurile și vizibilitatea.</p>
            </div>
            <div>
              <Link to="/list-item" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-5 py-2.5 rounded-md shadow-sm transition-colors text-sm">
                <span className="material-symbols-outlined text-lg">add</span>
                Adaugă Listare Nouă
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Listări</p>
                <p className="text-2xl font-bold text-text-main mt-1">124</p>
              </div>
              <div className="p-2 bg-blue-50 text-primary rounded-md">
                <span className="material-symbols-outlined">list_alt</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Active</p>
                <p className="text-2xl font-bold text-green-600 mt-1">86</p>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-md">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Vândute luna asta</p>
                <p className="text-2xl font-bold text-text-main mt-1">12</p>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
                <span className="material-symbols-outlined">sell</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Vizualizări</p>
                <p className="text-2xl font-bold text-text-main mt-1">3.4k</p>
              </div>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-md">
                <span className="material-symbols-outlined">visibility</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm flex flex-col">
            <div className="border-b border-[#e2e8f0] px-4 flex items-center gap-6 overflow-x-auto">
              <button className="py-4 border-b-2 border-primary text-primary font-medium text-sm whitespace-nowrap">Toate</button>
              <button className="py-4 border-b-2 border-transparent text-text-muted hover:text-text-main font-medium text-sm whitespace-nowrap">Active <span className="ml-1 bg-gray-100 text-xs px-1.5 py-0.5 rounded-full">86</span></button>
              <button className="py-4 border-b-2 border-transparent text-text-muted hover:text-text-main font-medium text-sm whitespace-nowrap">În așteptare <span className="ml-1 bg-gray-100 text-xs px-1.5 py-0.5 rounded-full">4</span></button>
              <button className="py-4 border-b-2 border-transparent text-text-muted hover:text-text-main font-medium text-sm whitespace-nowrap">Vândute <span className="ml-1 bg-gray-100 text-xs px-1.5 py-0.5 rounded-full">34</span></button>
              <button className="py-4 border-b-2 border-transparent text-text-muted hover:text-text-main font-medium text-sm whitespace-nowrap">Ciorne</button>
              <div className="ml-auto py-3 flex items-center gap-2">
                <button className="p-1.5 text-text-muted hover:text-text-main hover:bg-gray-100 rounded">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                </button>
                <button className="p-1.5 text-text-muted hover:text-text-main hover:bg-gray-100 rounded">
                  <span className="material-symbols-outlined text-lg">sort</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-[#e2e8f0] text-xs uppercase tracking-wide text-text-muted font-semibold">
                    <th className="px-6 py-3 w-12">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary/25" type="checkbox"/>
                    </th>
                    <th className="px-6 py-3">Detalii Produs</th>
                    <th className="px-6 py-3">SKU / ID</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Preț (RON)</th>
                    <th className="px-6 py-3 text-right">Vizualizări</th>
                    <th className="px-6 py-3 text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-sm">
                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary/25" type="checkbox"/>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded bg-gray-200 shrink-0 bg-cover bg-center border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDeZNX_BkJmCLTevYKZwEfhz_RsYlWJdveFzuDRIoZrrmZaffZgx28_GmDLorRwvwkptimWzHW88U4olPxGXynCQemXK___YVMF6a0tLZuw7FJ-V8Obnv6boOCMzQ9cpKesA1OcbdJJ95X2jpfB1bVSPz7GRVjN2nw6spR1w8f2bb0UhaNBWzUCvSTmQEJbqLpvSdDIxqU4exbkaIKVbICbQOMu7Hl8CZDxzPK1U7zh1QFw6Lacjqbu7Sr9btdpaObLxsAHcGlZz--u")'}}></div>
                        <div>
                          <h4 className="font-bold text-[#111418] group-hover:text-primary transition-colors">Țiglă Ceramică (Palet)</h4>
                          <p className="text-text-muted text-xs mt-0.5">Categorie: Acoperișuri</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-mono text-xs">RT-293-BUC</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <span className="size-1.5 rounded-full bg-green-500"></span>
                        Activ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[#111418]">850.00</td>
                    <td className="px-6 py-4 text-right text-text-muted">142</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-text-muted hover:text-primary tooltip" title="Edit">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-1 text-text-muted hover:text-red-600 tooltip" title="Delete">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                        <button className="p-1 text-text-muted hover:text-text-main tooltip" title="More">
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary/25" type="checkbox"/>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded bg-gray-200 shrink-0 bg-cover bg-center border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCz6X3wuXrueO0ZHGqpiqHFeOo6CaGZH2SePIElCPK3wdhNyHIlLD0Hn8a7ZzZvZmdwevlhH8LQVHjqg3kKQLVDcXEbBypmvxH7jkVe5sGk-inGf9mM4VNvhjoNjcF27x0QnZfJyUj0q4mzu5HBgM3k1VlulVUfGLMsyarY6em7Lo-lNtw44UhvU7aIkl2EqbbUFGu9vdh7qeB91k5H72-E4_1jAmyGHlFqBPkIGZhR4QYjOWaq7MhKZzQC7pnMmg4PVbdWDGWn-7y3")'}}></div>
                        <div>
                          <h4 className="font-bold text-[#111418] group-hover:text-primary transition-colors">Parchet Stejar (50m²)</h4>
                          <p className="text-text-muted text-xs mt-0.5">Categorie: Pardoseli</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-mono text-xs">PF-882-CLJ</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <span className="size-1.5 rounded-full bg-green-500"></span>
                        Activ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[#111418]">2,100.00</td>
                    <td className="px-6 py-4 text-right text-text-muted">89</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-text-muted hover:text-primary">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-1 text-text-muted hover:text-red-600">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                        <button className="p-1 text-text-muted hover:text-text-main">
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors group bg-gray-50/30">
                    <td className="px-6 py-4">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary/25" type="checkbox"/>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded bg-gray-200 shrink-0 bg-cover bg-center border border-gray-200 opacity-75" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1D8fgZX5Sj4u86miYNIptkW3qYTquD_YJx3wyIaaBKfHYM4qGdk9ZQRRikedly-KCLox_zE_CXROaBfKEGtY-dpfO8kX2kNGo6ghIgg3GaIsd_g9EC5Bjf7uLl8mB_ZC9OSD3V3kakmims3u1_7XB3A_P6WcqpROXHfVptlI6sXQgpdTcZZW0WoGllJ00z5sjO-vTOhwz6wvPUziK0Ztei0QbAGzE2Rb7nq1Y2mN4Sj2kpx_UyyCfLyefr-l4mT81FI4ls4F9qw2x")'}}></div>
                        <div>
                          <h4 className="font-bold text-[#111418] opacity-75">Chiuvete Baie Premium (Lot de 5)</h4>
                          <p className="text-text-muted text-xs mt-0.5">Categorie: Sanitare</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-mono text-xs">BS-102-TIM</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Vândut
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-text-muted">1,200.00</td>
                    <td className="px-6 py-4 text-right text-text-muted">324</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-text-muted hover:text-primary">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary/25" type="checkbox"/>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded bg-gray-200 shrink-0 bg-cover bg-center border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY")'}}></div>
                        <div>
                          <h4 className="font-bold text-[#111418] group-hover:text-primary transition-colors">Vată de Sticlă</h4>
                          <p className="text-text-muted text-xs mt-0.5">Categorie: Izolații</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-mono text-xs">GW-444-CON</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        În așteptare
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[#111418]">120.00</td>
                    <td className="px-6 py-4 text-right text-text-muted">56</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-text-muted hover:text-primary">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-1 text-text-muted hover:text-text-main">
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <input className="rounded border-gray-300 text-primary focus:ring-primary/25" type="checkbox"/>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded bg-gray-200 shrink-0 bg-cover bg-center border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAuSCvXwxG2k7vrRBDct7x5U8YsV-VxmLlHDK4QwS4aeiv3H3-leLIPdD2VdRIuWaVsV8ztCZ8aX-lPsl_inqjYJCVmTJtjUQEDXYl66r0BgFY8lzDgINdF02-dxcBbW3mv2RMmpt-xNDMpRurwx9Ow6sghHM2gDOYQT7oKsTIDGaUXhmq7wtGXaG0lmzs_qYQjCb5f8K3Ijv3mcZtUv20E-veO9llz1TFgBgyCa0Me10Ttr-6PK9HKMmznv6Un4Gh8AyrMYuXfkV8")'}}></div>
                        <div>
                          <h4 className="font-bold text-[#111418] group-hover:text-primary transition-colors">Set Bormașină Profesională Bosch</h4>
                          <p className="text-text-muted text-xs mt-0.5">Categorie: Unelte</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-mono text-xs">TL-992-BUC</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <span className="size-1.5 rounded-full bg-green-500"></span>
                        Activ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[#111418]">450.00</td>
                    <td className="px-6 py-4 text-right text-text-muted">21</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-text-muted hover:text-primary">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-1 text-text-muted hover:text-red-600">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                        <button className="p-1 text-text-muted hover:text-text-main">
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-text-muted">Se afișează <span className="font-medium text-text-main">1</span> până la <span className="font-medium text-text-main">5</span> din <span className="font-medium text-text-main">124</span> rezultate</p>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-[#e2e8f0] rounded text-sm text-text-muted hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
                <button className="px-3 py-1 border border-[#e2e8f0] rounded text-sm text-text-main hover:bg-gray-50">Următor</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;