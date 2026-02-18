"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

type CompanyDTO = {
  id: string;
  legal_name: string | null;
  display_name: string | null;
  cui: string | null;
  city: string | null;
  county: string | null;
  is_verified: boolean;
} | null;

export default function CompanyProfilePage() {
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyDTO>(null);

  // Local editable form state
  const [legalName, setLegalName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [cui, setCui] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw new Error(sessionErr.message);

        const token = sessionData.session?.access_token;
        if (!token) {
          throw new Error("Missing session token. Please login again.");
        }

        const res = await fetch("/api/login", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error ?? "Failed to load company profile.");
        }

        const c: CompanyDTO = json?.company ?? null;

        if (!mounted) return;

        setCompany(c);
        setLegalName(c?.legal_name ?? "");
        setDisplayName(c?.display_name ?? "");
        setCui(c?.cui ?? "");
        setCounty(c?.county ?? "");
        setCity(c?.city ?? "");
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Unknown error");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const verified = Boolean(company?.is_verified);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111418]">Profil Companie</h1>
        <p className="text-sm text-text-muted mt-1">
          Datele companiei și statusul de verificare.
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5 text-sm text-text-muted">
          Se încarcă profilul…
        </div>
      )}

      {!loading && error && (
        <div className="bg-white rounded-lg border border-red-200 shadow-sm p-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Status Verificare</h2>

            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  verified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <p className="text-sm font-bold">{verified ? "Verificat" : "În așteptare"}</p>
                <p className="text-xs text-text-muted">
                  {verified ? "Companie verificată" : "Verificare manuală (MVP)"}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full px-4 py-2.5 rounded-md bg-primary text-white font-medium hover:bg-primary-dark transition-colors text-sm"
              disabled={verified}
              title={verified ? "Compania este deja verificată" : "Solicită re-analiză"}
            >
              Solicită re-analiză
            </button>

            <p className="mt-2 text-xs text-text-muted">
              În MVP, re-analiza e manuală. Mai târziu: algoritm.
            </p>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Date Companie</h2>

            {!company && (
              <div className="bg-amber-50 border border-amber-100 rounded-md p-4 text-sm text-amber-900">
                Nu există companie asociată acestui cont. Dacă ești vânzător, completează onboarding-ul.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Nume Legal
                </label>
                <input
                  className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-sm bg-white"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  disabled={!company}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Nume Afișat
                </label>
                <input
                  className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-sm bg-white"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!company}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  CUI
                </label>
                <input
                  className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-sm bg-white"
                  value={cui}
                  onChange={(e) => setCui(e.target.value)}
                  disabled={!company}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Județ
                </label>
                <input
                  className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-sm bg-white"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  disabled={!company}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Oraș
                </label>
                <input
                  className="w-full rounded-md border border-[#e2e8f0] px-3 py-2 text-sm bg-white"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!company}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md border border-[#e2e8f0] text-sm hover:bg-gray-50"
                type="button"
                onClick={() => {
                  setLegalName(company?.legal_name ?? "");
                  setDisplayName(company?.display_name ?? "");
                  setCui(company?.cui ?? "");
                  setCounty(company?.county ?? "");
                  setCity(company?.city ?? "");
                }}
                disabled={!company}
              >
                Anulează
              </button>
              <button
                className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary-dark disabled:opacity-50"
                type="button"
                disabled
                title="Next step: wire to a PATCH /api/company endpoint"
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
