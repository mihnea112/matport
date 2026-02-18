"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");

  const loadRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (!error && data?.role) {
        const r = data.role === "admin" ? "admin" : "user";
        setRole(r);
        try {
          localStorage.setItem("matport_role", r);
        } catch {}
        return;
      }
    } catch {}

    try {
      const stored = localStorage.getItem("matport_role");
      if (stored === "admin" || stored === "user") setRole(stored);
    } catch {}
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const authed = Boolean(data.session);
      if (mounted) {
        setIsAuthed(authed);
        setChecking(false);
      }
      if (!authed) {
        router.replace("/login");
        return;
      }
      if (data.session?.user?.id) {
        await loadRole(data.session.user.id);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const authed = Boolean(session);
      setIsAuthed(authed);
      setChecking(false);
      if (!authed) {
        setRole("user");
        try {
          localStorage.removeItem("matport_role");
        } catch {}
        router.replace("/login");
        return;
      }
      if (session?.user?.id) {
        loadRole(session.user.id);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <p className="text-sm text-gray-600">Checking session…</p>
      </div>
    );
  }

  if (!isAuthed) return null;

  const navItem = (href: string, label: string, icon: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={[
          "flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors",
          active
            ? "bg-primary/5 text-primary"
            : "text-text-muted hover:bg-gray-50 hover:text-text-main",
        ].join(" ")}
      >
        <span
          className={`material-symbols-outlined ${active ? "material-symbols-filled" : ""}`}
        >
          {icon}
        </span>
        {label}
      </Link>
    );
  };

  return (
    <div className="bg-[#f8f9fa] text-text-main font-body antialiased min-h-screen overflow-hidden flex">
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col h-screen shrink-0 z-20">

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          {navItem("/dashboard", "Listările Mele", "inventory_2")}
          {navItem("/dashboard/messages", "Mesaje", "mail")}
          {navItem("/dashboard/profile", "Profil Companie", "business")}

          {role === "admin" && (
            <>
              <div className="my-4 border-t border-[#e2e8f0] mx-3"></div>
              <div className="px-3 pb-2 pt-1 text-[11px] uppercase tracking-wider text-text-muted font-bold">
                Admin
              </div>
              {navItem("/dashboard/admin/categories", "Categorii", "category")}
              {navItem("/dashboard/admin/listings", "Moderare Listări", "gavel")}
            </>
          )}

          <div className="my-4 border-t border-[#e2e8f0] mx-3"></div>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-muted hover:bg-gray-50 hover:text-text-main font-medium transition-colors text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            Deconectare
          </button>
        </nav>

        <div className="p-4 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
              MP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main">Cont</span>
              <span className="text-xs text-text-muted">Dashboard</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
