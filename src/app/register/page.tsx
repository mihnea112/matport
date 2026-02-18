"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

type AccountType = "buyer" | "seller";

const Register: React.FC = () => {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [accountType, setAccountType] = useState<AccountType>("buyer");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Company fields (required when accountType === 'seller')
  const [companyName, setCompanyName] = useState("");
  const [cui, setCui] = useState("");
  const [regCom, setRegCom] = useState("");
  const [vatRegistered, setVatRegistered] = useState(false);
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!terms) return setError("Trebuie să accepți Termenii și Condițiile.");
    if (password.length < 8)
      return setError("Parola trebuie să aibă minim 8 caractere.");
    if (!firstName.trim() || !lastName.trim())
      return setError("Completează prenumele și numele.");

    if (accountType === "seller") {
      if (!companyName.trim()) return setError("Completează numele legal al companiei.");
      if (!cui.trim()) return setError("Completează CUI-ul companiei.");
      if (!phone.trim()) return setError("Completează numărul de telefon.");
      // county/city are optional (recommended)
    }

    setLoading(true);

    // 1) Supabase Auth sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        // If email confirmation is ON, Supabase sends the link and redirects here after confirm.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          // optional: store a bit of metadata in auth (not required)
          account_type: accountType,
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      setError(
        "Cont creat. Verifică email-ul pentru confirmare (dacă e activată confirmarea).",
      );
      router.push("/register/success");
      localStorage.setItem(
        "matport_pending_register",
        JSON.stringify({
          accountType,
          accountKind: accountType === "seller" ? "company" : "individual",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || null,
          company:
            accountType === "seller"
              ? {
                  legal_name: companyName.trim(),
                  display_name: companyName.trim(),
                  cui: cui.trim(),
                  reg_com: regCom.trim() || null,
                  vat_registered: vatRegistered,
                  county: county.trim() || null,
                  city: city.trim() || null,
                  address_line1: null,
                  address_line2: null,
                  postal_code: null,
                  contact_name: fullName,
                  contact_email: email.trim().toLowerCase(),
                  contact_phone: phone.trim(),
                }
              : null,
        })
      );
      return;
    }

    // 2) Create app data via our API (does NOT call Supabase Auth)
    // If email confirmation is ON, there may be no active session yet.
    // In that case, we store the payload and finish onboarding after /auth/callback.
    const registerPayload = {
      accountType,
      accountKind: accountType === "seller" ? "company" : "individual",

      // profile
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || null,

      // company (only when seller)
      company:
        accountType === "seller"
          ? {
              legal_name: companyName.trim(),
              display_name: companyName.trim(),
              cui: cui.trim(),
              reg_com: regCom.trim() || null,
              vat_registered: vatRegistered,
              county: county.trim() || null,
              city: city.trim() || null,
              address_line1: null,
              address_line2: null,
              postal_code: null,
              contact_name: fullName,
              contact_email: email.trim().toLowerCase(),
              contact_phone: phone.trim(),
            }
          : null,
    };

    if (data.session) {
      // Send the access token so the API can identify the user even when SSR cookies are not present.
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        setLoading(false);
        setError(sessionErr.message);
        return;
      }

      const token = sessionData.session?.access_token;
      if (!token) {
        // No session token yet (likely email confirmation ON)
        localStorage.setItem("matport_pending_register", JSON.stringify(registerPayload));
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(registerPayload),
        });

        const json = await res.json();
        if (!res.ok) {
          setLoading(false);
          setError(json?.where ? `${json?.error} (${json?.where})` : (json?.error ?? "Failed to create account data."));
          return;
        }
      }
    } else {
      // No session yet (likely email confirmation ON)
      localStorage.setItem("matport_pending_register", JSON.stringify(registerPayload));
    }

    setLoading(false);

    // If confirmations are ON: session might not be active yet -> go to success.
    // If OFF: user is logged in immediately -> dashboard.
    router.push("/register/success");
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLDpZWai-yXSJQwvCVD2AQv3q8AcRUF6q377hH2P9kNVI6xT-j4KVJWbc4rdj87yF243XohLo3_9XCJU7z30RElTtPdhIY7wG4TqhbRPxO_KuPxAxlPvNFTZ3D-dQ1X4Ju57Pz_-AgGkzNPuBirJk2l8QaxjPL6HD9cIBL8fBnp6PtxwMOzQFW8Wg_YPmckY8QKD5X0d1KVKXPdPw9d0ruDsWNOFYwewm3P_92EJ7BdkxstYwngnqhMLa8i75j_7OaAHnlJXk9YUuY")',
        }}
      >
        <div className="absolute inset-0 bg-background-dark/40 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <h2 className="text-4xl font-black mb-4">Alătură-te comunității.</h2>
          <p className="text-lg opacity-90">
            Creează-ți cont gratuit și descoperă cele mai bune oferte de
            materiale de construcții.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-10 text-primary">
            <svg
              className="size-8"
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                fillRule="evenodd"
              ></path>
            </svg>
            <span className="font-display font-bold text-2xl text-[#111418] tracking-tight">
              MatPort
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-[#111418] mb-2">
            Creează cont nou
          </h1>
          <p className="text-[#617289] mb-8">
            Completează formularul de mai jos pentru a începe.
          </p>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="p-1 bg-[#f0f2f4] rounded-lg flex mb-6">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                  accountType === "buyer"
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#617289] hover:text-[#111418]"
                }`}
                onClick={() => setAccountType("buyer")}
              >
                Persoană fizică
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                  accountType === "seller"
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#617289] hover:text-[#111418]"
                }`}
                onClick={() => setAccountType("seller")}
              >
                Persoană juridică
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-bold text-[#111418] mb-2"
                  htmlFor="firstName"
                >
                  Prenume
                </label>
                <input
                  className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  id="firstName"
                  type="text"
                  placeholder="Ion"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-bold text-[#111418] mb-2"
                  htmlFor="lastName"
                >
                  Nume
                </label>
                <input
                  className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  id="lastName"
                  type="text"
                  placeholder="Popescu"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="phone">
                Telefon
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                id="phone"
                type="tel"
                placeholder="07xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {accountType === "seller" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="company">
                    Nume Legal Companie
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    id="company"
                    type="text"
                    placeholder="Construct S.R.L."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="cui">
                      CUI
                    </label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      id="cui"
                      type="text"
                      placeholder="RO1234567"
                      value={cui}
                      onChange={(e) => setCui(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="regCom">
                      Nr. Reg. Com. (opțional)
                    </label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      id="regCom"
                      type="text"
                      placeholder="J40/1234/2020"
                      value={regCom}
                      onChange={(e) => setRegCom(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="vatRegistered"
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={vatRegistered}
                    onChange={(e) => setVatRegistered(e.target.checked)}
                  />
                  <label htmlFor="vatRegistered" className="text-sm text-[#617289]">
                    Plătitor de TVA
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="county">
                      Județ / Sector (opțional)
                    </label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      id="county"
                      type="text"
                      placeholder="București"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111418] mb-2" htmlFor="city">
                      Oraș (opțional)
                    </label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      id="city"
                      type="text"
                      placeholder="București"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                className="block text-sm font-bold text-[#111418] mb-2"
                htmlFor="email"
              >
                Email
              </label>
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
              <label
                className="block text-sm font-bold text-[#111418] mb-2"
                htmlFor="password"
              >
                Parolă
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg border border-[#e2e8f0] text-[#111418] placeholder:text-[#617289] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-[#617289] mt-1">
                Minim 8 caractere, o literă mare și un număr.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-[#617289]">
                Sunt de acord cu{" "}
                <a href="#" className="text-primary hover:underline">
                  Termenii și Condițiile
                </a>{" "}
                și{" "}
                <a href="#" className="text-primary hover:underline">
                  Politica de Confidențialitate
                </a>{" "}
                MatPort.
              </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Se creează..." : "Creează Cont"}
            </button>
          </form>

          <p className="mt-8 text-center text-[#617289]">
            Ai deja un cont?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline"
            >
              Autentifică-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
