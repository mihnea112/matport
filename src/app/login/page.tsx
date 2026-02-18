"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

const Login: React.FC = () => {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    // Bootstrap app data (profiles/company) via our API (does not call Supabase Auth)
    // Our /api/login expects an Authorization: Bearer <access_token> header.
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) {
      setLoading(false);
      setError(sessionErr.message);
      return;
    }

    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setLoading(false);
      setError("Missing session token after login.");
      return;
    }

    const res = await fetch("/api/login", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(json?.error ?? "Failed to load account data.");
      return;
    }

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 bg-cover bg-center relative" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfGJg6WlQYZCb_fFdCLHhcm_fgzFBzoqO90fRB8bfXSy_8A49pxfZp1bPselrezqOJ69PmxXV9wgrUJ_W80MlfMgeq8cQX4DpESI9_7HfJuSqw0CaNVCL6vE7FGWoQQvKyy3OfzGvCVfGn0egkttedORbJXMdUauVbT_IaNaKqodLGWbX3POmLgMkYOI8iJQ8DYjQ2vaJfgnQtYMMerxMBcniEDmQLyOex6Zf5w_Kp8M689mUhx_tA2pLwGAoGFp7lv2V9PPzZ5kqq")'}}>
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <h2 className="text-4xl font-black mb-4">Construiește inteligent.</h2>
          <p className="text-lg opacity-90">Accesează mii de oferte de lichidare de stoc direct de la distribuitori.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-10 text-primary">
             <svg className="size-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
            </svg>
            <span className="font-display font-bold text-2xl text-[#111418] tracking-tight">MatPort</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#111418] mb-2">Bine ai revenit</h1>
          <p className="text-[#617289] mb-8">Introdu datele pentru a accesa contul tău.</p>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="email">Email</label>
              <input 
                className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                id="email" 
                type="email" 
                placeholder="nume@exemplu.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#111418]" htmlFor="password">Parolă</label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">Ai uitat parola?</Link>
              </div>
              <input 
                className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Se autentifică..." : "Autentificare"}
            </button>
          </form>

            <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2e8f0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-[#617289]">sau continuă cu</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-12 border border-[#e2e8f0] rounded-lg hover:bg-neutral-light transition-colors font-medium text-[#111418]">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
             <button className="flex items-center justify-center gap-2 h-12 border border-[#e2e8f0] rounded-lg hover:bg-neutral-light transition-colors font-medium text-[#111418]">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-[#617289]">
            Nu ai un cont? <Link href="/register" className="font-bold text-primary hover:underline">Înregistrează-te</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;