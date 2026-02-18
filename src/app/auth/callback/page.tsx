"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  useEffect(() => {
    (async () => {
      // Ensure Supabase processes the callback URL and stores the session (if any).
      await supabase.auth.getSession();
      router.replace("/login");
    })();
  }, [router, supabase]);

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold">Confirming…</h1>
      <p className="mt-2 text-neutral-700">Redirecting you to login.</p>
    </div>
  );
}
