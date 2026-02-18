import React from "react";
import Link from "next/link";

export default function SellerDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 lg:px-8">
        <div className="hidden md:flex items-center text-sm text-text-muted">
          <span>Panou de control</span>
          <span className="material-symbols-outlined text-base mx-1">
            chevron_right
          </span>
          <span className="text-text-main font-medium">Listările Mele</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-[#e2e8f0] rounded-md focus:ring-1 focus:ring-primary focus:border-primary w-64 placeholder:text-gray-400"
              placeholder="Caută inventar..."
              type="text"
            />
          </div>

          <button
            className="relative p-2 text-text-muted hover:text-primary transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#111418]">
              Listările Mele
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Gestionează inventarul, prețurile și vizibilitatea.
            </p>
          </div>

          <Link
            href="/list-item"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-5 py-2.5 rounded-md shadow-sm transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Adaugă Listare Nouă
          </Link>
        </div>

        {/* Keep your table UI as-is for now (you already have it). */}
        {/* Later we hook it to /api/listings and filter by company. */}
        <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm p-6">
          <p className="text-sm text-text-muted">
            Next step: we load listings from DB for the seller company and
            render them here.
          </p>
        </div>
      </div>
    </div>
  );
}
