"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

const SellerListing: React.FC = () => {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to POST /api/listings
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
                      >
                        <option>Selectează o categorie...</option>
                        <option>Structurale (Ciment, Cărămidă)</option>
                        <option>Izolații</option>
                        <option>Acoperișuri</option>
                        <option>Finisaje (Gresie, Parchet)</option>
                        <option>Electrice & Sanitare</option>
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
                            />
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
                        />
                      </div>
                      <div>
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  className="text-sm font-bold text-gray-600 hover:text-gray-900"
                  type="button"
                >
                  Anulează
                </button>
                <button
                  className="w-full sm:w-auto px-8 py-3 bg-seller-primary text-white text-base font-bold rounded-lg hover:bg-seller-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  type="submit"
                >
                  <span>Publică Listarea</span>
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
