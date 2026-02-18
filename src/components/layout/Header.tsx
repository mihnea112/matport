"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

const Header: React.FC = () => {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setIsAuthed(Boolean(data.session));
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session));
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#f0f2f4]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-[#111418] text-xl font-bold tracking-tight">MatPort</h2>
        </Link>
        
        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="flex w-full items-center rounded-lg bg-[#f0f2f4] h-10 px-3 gap-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <span className="material-symbols-outlined text-[#617289]">search</span>
            <input 
              className="w-full bg-transparent border-none p-0 text-sm text-[#111418] placeholder:text-[#617289] focus:ring-0" 
              placeholder="Caută ciment, gresie, unelte..."
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/list-item" className="text-sm font-medium hover:text-primary transition-colors">
              Listează un produs
            </Link>

            {isAuthed ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Panou de control
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Deconectare
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Autentificare
              </Link>
            )}
          </div>
          <Link href="/search" className="bg-primary text-white text-sm font-bold px-5 h-10 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap flex items-center">
            Răsfoiește Materiale
          </Link>
          <div className="md:hidden">
            <button className="flex items-center justify-center p-2">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;