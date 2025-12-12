import Image from "next/image";
const listings = [
  {
    title: "Ciment 25kg (paleți)",
    qty: "18 paleți",
    location: "București",
    price: "45 RON/sac",
    tag: "Surplus",
    time: "Postat azi",
  },
  {
    title: "Rigips 12.5mm",
    qty: "220 plăci",
    location: "Cluj",
    price: "28 RON/placă",
    tag: "Clearance",
    time: "Postat ieri",
  },
  {
    title: "Vată bazaltică 10cm",
    qty: "90 baxuri",
    location: "Timișoara",
    price: "— negociabil",
    tag: "Urgent",
    time: "Postat acum 2 zile",
  },
];

const categories = [
  "Ciment & mortare",
  "Gips-carton",
  "Izolații",
  "Oțel & armături",
  "Lemn & OSB",
  "Adezivi & chimice",
];

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-4 md:px-10 lg:px-16">{children}</div>;
}

function BrandGradientLine() {
  return (
    <div className="h-[2px] w-full bg-gradient-to-r from-brand-green via-brand-teal to-brand-blue opacity-90" />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/5">
        <Wrap>
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Replace with your logo file */}
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-green via-brand-teal to-brand-blue shadow-soft" />
              <div className="leading-tight">
                <a href="#" className="flex items-center">
                  <Image
                    src="/logo.jpg"
                    alt="Matport"
                    width={400}
                    height={120}
                    priority
                    className="h-20 w-auto object-contain"
                  />
                </a>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm text-black/70">
              <a className="hover:text-brand-navy" href="#how">
                Cum funcționează
              </a>
              <a className="hover:text-brand-navy" href="#market">
                Marketplace
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <button className="hidden sm:inline-flex rounded-xl px-4 py-2 text-sm font-semibold border border-black/10 hover:bg-black/5">
                Log in
              </button>
              <button className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-soft bg-gradient-to-r from-brand-green via-brand-teal to-brand-blue hover:opacity-95">
                List surplus
              </button>
            </div>
          </div>
        </Wrap>
        <BrandGradientLine />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(61,198,106,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(2,130,181,0.18),transparent_45%)]" />
        <Wrap>
          <div className="py-16 md:py-20 relative">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/60">
                  <span className="h-2 w-2 rounded-full bg-brand-green" />
                  Vinde rapid materiale rămase din proiecte
                </div>

                <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-brand-navy">
                  Eliberează stocul.
                  <span className="block bg-gradient-to-r from-brand-green via-brand-teal to-brand-blue bg-clip-text text-transparent">
                    Crește cashflow-ul.
                  </span>
                </h1>

                <p className="mt-4 text-base md:text-lg text-black/70 max-w-2xl">
                  Matport este marketplace-ul B2B unde firmele de construcții
                  își listează surplusul de materiale, iar alte companii îl
                  cumpără la prețuri bune, fără risipă și fără bătăi de cap.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button className="rounded-2xl px-5 py-3 font-semibold bg-navy text-white shadow-soft hover:bg-brand-navy/90">
                    Explorează marketplace
                  </button>
                  <button className="rounded-2xl px-5 py-3 font-semibold border border-black/10 bg-white/70 hover:bg-black/5">
                    Cum listezi în 2 minute
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
                  <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                    <div className="text-xl font-extrabold">24h</div>
                    <div className="text-xs text-black/60 mt-1">
                      timp mediu pentru primele cereri (demo)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                    <div className="text-xl font-extrabold">0%</div>
                    <div className="text-xs text-black/60 mt-1">
                      taxă de listare (demo)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                    <div className="text-xl font-extrabold">B2B</div>
                    <div className="text-xs text-black/60 mt-1">
                      doar firme, nu random
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero card */}
              <div className="rounded-3xl border border-black/10 bg-white shadow-soft p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Caută materiale</div>
                    <div className="text-xs text-black/50">demo search UI</div>
                  </div>
                  <div className="h-9 w-9 rounded-2xl bg-brand-tint border border-black/10" />
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-black/10 p-3">
                    <div className="text-xs text-black/50">Categorie</div>
                    <div className="font-semibold">
                      Izolații, ciment, rigips…
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/10 p-3">
                    <div className="text-xs text-black/50">Locație</div>
                    <div className="font-semibold">
                      București / Cluj / Timișoara
                    </div>
                  </div>
                  <button className="rounded-2xl px-4 py-3 font-semibold text-white bg-gradient-to-r from-brand-green via-brand-teal to-brand-blue">
                    Caută în Matport
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-brand-tint p-4 border border-black/10">
                  <div className="text-sm font-semibold">
                    Tip: “surplus verified” (demo)
                  </div>
                  <div className="text-xs text-black/60 mt-1">
                    Listări de la firme — cantități, poze, documente, livrare /
                    ridicare.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Marketplace preview */}
      <section id="market" className="bg-brand-tint/60 border-y border-black/5">
        <Wrap>
          <div className="py-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Marketplace
                </h2>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <input
                  className="w-full md:w-96 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue/30"
                  placeholder="Caută: ciment, rigips, izolație..."
                />
                <button className="rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-brand-green via-brand-teal to-brand-blue">
                  Search
                </button>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {listings.map((l) => (
                <div
                  key={l.title}
                  className="rounded-3xl border border-black/10 bg-white p-5 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-extrabold leading-snug">
                      {l.title}
                    </div>
                    <span className="text-xs font-semibold rounded-full px-3 py-1 bg-black/5 border border-black/10">
                      {l.tag}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-1 text-sm text-black/65">
                    <div>
                      <span className="text-black/45">Cantitate:</span> {l.qty}
                    </div>
                    <div>
                      <span className="text-black/45">Locație:</span>{" "}
                      {l.location}
                    </div>
                    <div>
                      <span className="text-black/45">Preț:</span> {l.price}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-black/45">{l.time}</div>
                    <button className="rounded-2xl px-4 py-2 text-sm font-semibold border border-black/10 hover:bg-black/5">
                      Vezi detalii
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-extrabold">
                    Ai surplus în depozit?
                  </div>
                  <div className="text-sm text-black/65 mt-1">
                    Listează azi și transformă stocul în cash, fără să “strici”
                    prețurile din piață.
                  </div>
                </div>
                <button className="rounded-2xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-brand-green via-brand-teal to-brand-blue">
                  List surplus
                </button>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Categories */}
      <section>
        <Wrap>
          <div className="py-16">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Categorii populare
            </h3>
            <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((c) => (
                <div
                  key={c}
                  className="rounded-2xl border border-black/10 p-4 hover:bg-black/5 cursor-pointer bg-white"
                >
                  <div className="font-semibold">{c}</div>
                  <div className="text-xs text-black/50 mt-1">
                    Vezi listări disponibile
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>
      {/* How it works */}
      <section id="how">
        <Wrap>
          <div className="py-16">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Cum funcționează
            </h2>
            <p className="mt-2 text-black/65 max-w-3xl">
              Flux simplu, fără “platform fatigue”. Minimal, eficient, orientat
              pe tranzacții B2B.
            </p>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Listezi surplusul",
                  desc: "Cantitate, locație, preț, poze. Optional: documente.",
                  n: "01",
                },
                {
                  title: "Primești cereri B2B",
                  desc: "Doar firme — filtrare pe categorie și proximitate.",
                  n: "02",
                },
                {
                  title: "Închizi deal-ul",
                  desc: "Ridicare / livrare, factură, cashflow mai bun.",
                  n: "03",
                },
              ].map((x) => (
                <div
                  key={x.n}
                  className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft"
                >
                  <span className="text-xs font-bold text-white rounded-full px-3 py-1 bg-gradient-to-r from-brand-green via-brand-teal to-brand-blue">
                    {x.n}
                  </span>
                  <div className="mt-4 text-lg font-extrabold">{x.title}</div>
                  <div className="mt-2 text-sm text-black/65">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5">
        <Wrap>
          <div className="py-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-green via-brand-teal to-brand-blue" />
              <div className="text-sm text-black/60">
                © {new Date().getFullYear()} Matport. Demo UI.
              </div>
            </div>
            <div className="flex gap-6 text-sm text-black/60">
              <a className="hover:text-brand-navy" href="#">
                Termeni
              </a>
              <a className="hover:text-brand-navy" href="#">
                Confidențialitate
              </a>
              <a className="hover:text-brand-navy" href="#">
                Contact
              </a>
            </div>
          </div>
        </Wrap>
      </footer>
    </main>
  );
}
