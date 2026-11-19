import type { FormEvent, MouseEvent, ReactNode } from "react";
import { useState } from "react";

import StoryBlock from "./StoryBlock";
import { asset } from "./stories";
import {
  breaking,
  closing,
  footerColumns,
  latest,
  legalLinks,
  more,
  opening,
  recommended,
  topics,
  type Article,
} from "./home-data";

const icons = {
  search: asset("90c99.svg"),
  person: asset("84b0e.svg"),
  logo: asset("b87b7.svg"),
  mediahuis: asset("ce74a.svg"),
  premium: asset("1376f.png"),
  comment: asset("8b6f8.svg"),
  chevron: asset("bd334.svg"),
  play: asset("dbf2e.svg"),
  socials: [
    { label: "X", src: asset("3f8f3.svg") },
    { label: "Instagram", src: asset("3d069.svg") },
    { label: "Facebook", src: asset("6c81e.svg") },
    { label: "LinkedIn", src: asset("470d1.svg") },
  ],
};

/* ----------------------------------------------------------------------------
 * Primitives
 * ------------------------------------------------------------------------- */

/** Same horizontal rhythm as the StoryBlock so every section lines up. */
function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 xl:px-0 ${className}`}>
      {children}
    </div>
  );
}

const preventNav = (event: MouseEvent) => event.preventDefault();

function ArticleLink({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href="#"
      onClick={preventNav}
      className={`group block rounded-[6px] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#2766f5] ${className}`}
    >
      {children}
    </a>
  );
}

function Title({ article, className }: { article: Article; className: string }) {
  return (
    <h3 className={`font-black tracking-[-0.01em] text-balance group-hover:underline ${className}`}>
      {article.premium && (
        <img
          src={icons.premium}
          alt="Premium"
          className="mr-1.5 inline-block size-[0.95em] translate-y-[-0.08em] rounded-[3px] align-middle"
        />
      )}
      {article.title}
    </h3>
  );
}

function Meta({ article, tone }: { article: Article; tone: "light" | "dark" }) {
  if (!article.label && !article.time) return null;
  return (
    <p
      className={`flex items-center gap-1.5 text-[12px] leading-4 ${
        tone === "dark" ? "text-white/80" : "text-[#74797a]"
      }`}
    >
      {article.label && (
        <span
          className={`font-bold uppercase tracking-[0.04em] ${
            tone === "dark" ? "text-white" : "text-[#27509a]"
          }`}
        >
          {article.label}
        </span>
      )}
      {article.time && <time>{article.time}</time>}
      {article.comments && (
        <img src={icons.comment} alt="Reacties" className="size-3.5 opacity-80" />
      )}
    </p>
  );
}

function Picture({
  article,
  className = "",
  eager,
}: {
  article: Article;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#e0e0e0] ${className}`}>
      {article.image && (
        <img
          src={article.image}
          alt=""
          loading={eager ? "eager" : "lazy"}
          style={{ objectPosition: article.focus ?? "center" }}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      )}
      {article.video && (
        <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-[#2766f5] shadow-lg">
          <img src={icons.play} alt="Video" className="size-4" />
        </span>
      )}
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute top-3 left-3 rounded-[3px] bg-[#e72501] px-2 py-1 text-[12px] leading-4 font-bold text-white uppercase sm:top-5 sm:left-5 sm:text-[13px]">
      {children}
    </span>
  );
}

function SectionHeading({
  children,
  tone = "light",
  action,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  action?: ReactNode;
}) {
  return (
    <div
      className={`flex items-baseline justify-between border-t-4 pt-5 ${
        tone === "dark" ? "border-white" : "border-[#202223]"
      }`}
    >
      <h2
        className={`text-[14px] leading-[1.15] font-bold uppercase ${
          tone === "dark" ? "text-white" : "text-[#202223]"
        }`}
      >
        {children}
      </h2>
      {action}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Teasers
 * ------------------------------------------------------------------------- */

/** Image on top, text below. */
function CardTeaser({ article, tone = "light" }: { article: Article; tone?: "light" | "dark" }) {
  return (
    <ArticleLink className="flex h-full flex-col gap-2.5">
      <Picture article={article} className="aspect-[3/2] rounded-[6px]" />
      <Meta article={article} tone={tone} />
      <Title
        article={article}
        className={`text-[15px] leading-[1.2] sm:text-[17px] ${
          tone === "dark" ? "text-white" : "text-[#202223]"
        }`}
      />
    </ArticleLink>
  );
}

/** Text on top of the image with a dark gradient. */
function OverlayTeaser({
  article,
  size,
  className = "",
  eager,
}: {
  article: Article;
  size: "hero" | "large" | "tall";
  className?: string;
  eager?: boolean;
}) {
  const ratio = {
    hero: "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[2/1]",
    large: "aspect-[4/5] sm:aspect-[16/10]",
    tall: "aspect-[4/5]",
  }[size];
  const titleSize = {
    hero: "text-[26px] leading-[1.08] sm:text-[36px] lg:text-[44px]",
    large: "text-[24px] leading-[1.1] uppercase sm:text-[32px] lg:text-[36px]",
    tall: "text-[18px] leading-[1.15] lg:text-[19px]",
  }[size];

  return (
    <ArticleLink className={`relative overflow-hidden rounded-[8px] ${className}`}>
      <Picture article={{ ...article, video: false }} className={ratio} eager={eager} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      {article.badge && <Badge>{article.badge}</Badge>}
      {article.video && (
        <span className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-[#2766f5] shadow-lg">
          <img src={icons.play} alt="Video" className="size-4" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-6">
        <Meta article={article} tone="dark" />
        <Title article={article} className={`text-white ${titleSize}`} />
      </div>
    </ArticleLink>
  );
}

/** Small thumbnail next to the title. */
function CompactTeaser({ article }: { article: Article }) {
  return (
    <ArticleLink className="flex h-full gap-3 bg-white/10 p-3 transition-colors hover:bg-white/15">
      <Picture article={article} className="aspect-square w-[72px] shrink-0 rounded-[4px] sm:w-[84px]" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <Meta article={article} tone="dark" />
        <Title article={article} className="text-[14px] leading-[1.2] text-white sm:text-[15px]" />
      </div>
    </ArticleLink>
  );
}

/* ----------------------------------------------------------------------------
 * Page sections
 * ------------------------------------------------------------------------- */

/** Desktop only: blue service bar above the white header. */
function ServiceBar() {
  return (
    <div className="hidden bg-[#27509a] text-white md:block">
      <Container className="flex h-10 items-center justify-between">
        <button
          type="button"
          className="-ml-2 flex h-8 items-center gap-1.5 rounded px-2 text-[14px] font-bold hover:bg-white/10"
        >
          <img src={icons.search} alt="" className="size-4" />
          Menu
        </button>
        <div className="flex items-center gap-1 text-[14px]">
          <a href="#" onClick={preventNav} className="rounded px-2 py-1.5 hover:bg-white/10">
            Nieuwsbrieven
          </a>
          <a href="#" onClick={preventNav} className="rounded px-2 py-1.5 hover:bg-white/10">
            Puzzels
          </a>
          <a
            href="#"
            onClick={preventNav}
            className="ml-1 rounded-[4px] bg-[#ffcb3d] px-3 py-1.5 font-bold text-[#202223] transition-colors hover:bg-[#ffd866]"
          >
            Abonneer
          </a>
          <a
            href="#"
            onClick={preventNav}
            className="flex items-center gap-1.5 rounded px-2 py-1.5 font-bold hover:bg-white/10"
          >
            <img src={icons.person} alt="" className="size-4" />
            Inloggen
          </a>
        </div>
      </Container>
    </div>
  );
}

/**
 * Mobile: one blue bar (menu · logo · account) with white topics below.
 * Desktop: white bar with logo and topics, under the blue ServiceBar.
 */
function SiteHeader() {
  const [active, setActive] = useState("Nieuws");
  return (
    <header className="sticky top-0 z-30 bg-[#27509a] text-white md:border-b md:border-black/10 md:bg-white/95 md:text-[#202223] md:backdrop-blur">
      <Container className="flex flex-col md:h-16 md:flex-row md:items-center md:gap-10">
        <div className="relative flex h-14 shrink-0 items-center justify-center md:h-auto">
          <button
            type="button"
            aria-label="Menu en zoeken"
            className="absolute left-0 -ml-2 flex size-10 items-center justify-center rounded-full hover:bg-white/10 md:hidden"
          >
            <img src={icons.search} alt="" className="size-5" />
          </button>
          <a
            href="#"
            onClick={preventNav}
            aria-label="De Telegraaf, naar de voorpagina"
            className="rounded outline-offset-4 focus-visible:outline-2 focus-visible:outline-white md:focus-visible:outline-[#2766f5]"
          >
            <img
              src={icons.logo}
              alt=""
              className="h-7 w-auto brightness-0 invert md:filter-none lg:h-8"
            />
          </a>
          <a
            href="#"
            onClick={preventNav}
            aria-label="Inloggen"
            className="absolute right-0 -mr-2 flex size-10 items-center justify-center rounded-full hover:bg-white/10 md:hidden"
          >
            <img src={icons.person} alt="" className="size-5" />
          </a>
        </div>
        <nav
          aria-label="Rubrieken"
          className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:mx-0 md:gap-1 md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {topics.map((topic) => {
            const current = topic === active;
            return (
              <a
                key={topic}
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setActive(topic);
                }}
                aria-current={current ? "page" : undefined}
                className={`relative shrink-0 rounded text-[16px] whitespace-nowrap transition-colors md:px-3 md:py-2 md:text-[15px] md:font-bold md:hover:text-[#27509a] ${
                  current
                    ? "font-bold md:text-[#27509a] md:after:absolute md:after:inset-x-3 md:after:-bottom-[13px] md:after:h-[3px] md:after:rounded-full md:after:bg-[#27509a]"
                    : "font-medium text-white/90 hover:text-white md:text-[#202223]"
                }`}
              >
                {topic}
              </a>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}

function BreakingZone() {
  return (
    <section aria-label="Uitgelicht" className="bg-[#27509a]">
      <Container className="flex flex-col gap-3 py-3 sm:py-6">
        <OverlayTeaser article={breaking.hero} size="hero" eager />
        <div className="grid gap-3 md:grid-cols-3">
          {breaking.related.map((article) => (
            <CompactTeaser key={article.id} article={article} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
          {breaking.row.map((article) => (
            <CardTeaser key={article.id} article={article} tone="dark" />
          ))}
        </div>
      </Container>
    </section>
  );
}

function LatestNews() {
  return (
    <aside aria-labelledby="latest-heading" className="rounded-[8px] bg-[#f6f8f9] p-5">
      <div className="flex items-center justify-between">
        <h2 id="latest-heading" className="text-[14px] font-bold text-[#202223] uppercase">
          Laatste nieuws
        </h2>
        <a
          href="#"
          onClick={preventNav}
          className="flex items-center gap-0.5 text-[13px] font-bold text-[#2b70e8] hover:underline"
        >
          Alles <img src={icons.chevron} alt="" className="size-4" />
        </a>
      </div>
      <ol className="mt-3 divide-y divide-black/10">
        {latest.map((article) => (
          <li key={article.id}>
            <ArticleLink className="flex gap-3 py-3">
              <time className="w-10 shrink-0 pt-px text-[13px] font-bold text-[#e72501] tabular-nums">
                {article.time}
              </time>
              <Title article={article} className="text-[14px] leading-[1.25] text-[#202223]" />
            </ArticleLink>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function OpeningZone() {
  return (
    <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-6">
        <OverlayTeaser article={opening.hero} size="large" />
        <div className="grid grid-cols-2 gap-4">
          {opening.secondary.map((article) => (
            <CardTeaser key={article.id} article={article} />
          ))}
        </div>
      </div>
      <LatestNews />
    </Container>
  );
}

function AdSlot({ format }: { format: "billboard" | "rectangle" }) {
  const size =
    format === "billboard"
      ? "mx-auto h-[100px] max-w-[970px] sm:h-[250px]"
      : "min-h-[250px] h-full";
  return (
    <div
      role="complementary"
      aria-label="Advertentie"
      className={`flex w-full flex-col items-center justify-center rounded-[4px] border border-dashed border-[#b6b8bb] bg-[#f6f8f9] ${size}`}
    >
      <span className="text-[11px] tracking-[0.08em] text-[#919191] uppercase">Advertentie</span>
    </div>
  );
}

function RecommendedZone() {
  return (
    <section aria-labelledby="recommended-heading" className="bg-[#27509a] py-8 sm:py-10">
      <Container className="flex flex-col gap-5">
        <SectionHeading tone="dark">
          <span id="recommended-heading">Aanbevolen door de redactie</span>
        </SectionHeading>
        <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {recommended.map((article) => (
            <OverlayTeaser
              key={article.id}
              article={article}
              size="tall"
              className="w-[72vw] max-w-[300px] shrink-0 snap-start sm:w-[42vw] lg:w-auto lg:max-w-none"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setDone(true);
  };
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="flex h-full flex-col gap-3 rounded-[8px] bg-[#edf2f6] p-5"
    >
      <h2 id="newsletter-heading" className="text-[20px] leading-[1.15] font-black text-[#202223]">
        Abonneer op onze nieuwsbrief
      </h2>
      <p className="text-[14px] leading-[1.45] text-[#525759]">
        Schrijf u in en blijf dagelijks op de hoogte van het belangrijkste nieuws uit uw regio.
      </p>
      {done ? (
        <p role="status" className="mt-auto rounded-[4px] bg-white p-3 text-[14px] font-bold text-[#27509a]">
          Bedankt! Check je inbox om je inschrijving te bevestigen.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-auto flex flex-col gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            E-mailadres
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="jouw@email.nl"
            className="h-11 rounded-[4px] border border-[#b6b8bb] bg-white px-3 text-[15px] text-[#202223] placeholder:text-[#919191] focus:border-[#27509a] focus:outline-2 focus:outline-[#27509a]/30"
          />
          <button
            type="submit"
            className="h-11 rounded-[4px] bg-[#27509a] text-[15px] font-bold text-white transition-colors hover:bg-[#0c1f59]"
          >
            Inschrijven
          </button>
        </form>
      )}
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-4 bg-black text-white">
      <Container className="flex flex-col gap-10 py-10 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <img src={icons.logo} alt="De Telegraaf" className="h-8 w-auto self-start brightness-0 invert" />
          <ul className="flex gap-2" aria-label="Volg ons">
            {icons.socials.map((social) => (
              <li key={social.label}>
                <a
                  href="#"
                  onClick={preventNav}
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <img src={social.src} alt="" className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-[13px] font-bold tracking-[0.06em] text-white/60 uppercase">
                {column.title}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" onClick={preventNav} className="text-[15px] text-white/90 hover:text-white hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-5 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/70">
            {legalLinks.map((link) => (
              <li key={link}>
                <a href="#" onClick={preventNav} className="hover:text-white hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 text-[13px] text-white/60">
            <span>© {new Date().getFullYear()} Alle rechten voorbehouden</span>
            <img src={icons.mediahuis} alt="Mediahuis" className="h-4 w-auto" />
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function App() {
  return (
    <div className="min-h-dvh bg-white font-sans text-[#202223]">
      <ServiceBar />
      <SiteHeader />

      <main className="flex flex-col gap-8 pb-10 sm:gap-10">
        <BreakingZone />
        <OpeningZone />

        <Container>
          <AdSlot format="billboard" />
        </Container>

        <StoryBlock />

        <RecommendedZone />

        <Container className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {more.map((article) => (
            <CardTeaser key={article.id} article={article} />
          ))}
        </Container>

        <Container>
          <AdSlot format="billboard" />
        </Container>

        <Container className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {closing.map((article) => (
            <CardTeaser key={article.id} article={article} />
          ))}
          <div className="col-span-2 sm:col-span-1">
            <Newsletter />
          </div>
          <div className="col-span-2 hidden sm:col-span-1 sm:block">
            <AdSlot format="rectangle" />
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
