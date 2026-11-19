import { useCallback, useEffect, useRef, useState } from "react";

import { CATEGORIES, asset, type Story } from "./stories";
import { useFeed } from "./feed";

const roboto = { fontVariationSettings: '"wdth" 100' } as const;

/**
 * Mobile (< sm): carousel. The active card is full height; the others are 30px
 * shorter. The first card snaps to the start, the last to the end, all others
 * to the centre. From sm up the cards keep their original 5:9 layout.
 */
const mobileCard = "min(66vw,300px)";

function Teaser({
  story,
  active,
  snap,
}: {
  story: Story;
  active: boolean;
  snap: "start" | "center" | "end";
}) {
  const snapClass = { start: "snap-start", center: "snap-center", end: "snap-end" }[snap];
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      data-active={active || undefined}
      className={`group relative block w-[var(--card-w)] shrink-0 overflow-hidden rounded-[8px] bg-[#2b2d2f] outline-offset-2 transition-[height] duration-[450ms] ease-[cubic-bezier(0.33,1,0.68,1)] focus-visible:outline-2 focus-visible:outline-[#2766f5] motion-reduce:transition-none ${snapClass} ${
        active ? "h-[calc(var(--card-w)*9/5)]" : "h-[calc(var(--card-w)*9/5-20px)]"
      } sm:aspect-[5/9] sm:h-auto sm:w-[42vw] sm:max-w-[300px] sm:snap-start md:w-[calc((100%-32px)/2.6)] lg:w-[calc((100%-48px)/3.4)] xl:w-[300px]`}
    >
      {story.image && (
        <img
          alt=""
          loading="lazy"
          src={story.image}
          style={{ objectPosition: story.focus ?? "center" }}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.5)] to-transparent px-4 pt-[57px] pb-4 backdrop-blur-[3px] [mask-image:linear-gradient(to_top,black_60%,transparent)]">
        <p
          className="[word-break:break-word] font-['Roboto:Black'] text-[15px] leading-[1.15] font-black text-white group-hover:underline sm:text-[16px]"
          style={roboto}
        >
          {story.title}
        </p>
      </div>
    </a>
  );
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.matchMedia("(max-width: 639.98px)").matches;
const getCards = (row: HTMLElement) =>
  Array.from(row.querySelectorAll<HTMLElement>(":scope > div > a"));

/** scrollLeft that puts card `index` in place: first left, last right, the rest centred. */
function targetLeft(row: HTMLElement, cards: HTMLElement[], index: number) {
  const max = row.scrollWidth - row.clientWidth;
  if (index <= 0) return 0;
  if (index >= cards.length - 1) return max;
  const card = cards[index];
  return Math.max(0, Math.min(max, card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2));
}

export default function StoryBlock() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const { openFeed } = useFeed();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [current, setCurrent] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  const currentRef = useRef(0);
  currentRef.current = current;

  const updateArrows = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setCanPrev(row.scrollLeft > 4);
    setCanNext(row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
  }, []);

  // Measure at most once per frame while the row is scrolling.
  const frame = useRef(0);
  const onRowScroll = () => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      updateArrows();
    });
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Custom scroll animation: eases out smoothly and starts at the swipe's speed.
  const animation = useRef(0);
  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(animation.current);
    animation.current = 0;
  }, []);
  useEffect(() => stopAnimation, [stopAnimation]);

  const animateTo = useCallback(
    (row: HTMLElement, to: number, velocity = 0) => {
      stopAnimation();
      const from = row.scrollLeft;
      const distance = to - from;
      if (Math.abs(distance) < 1 || reducedMotion()) {
        row.scrollLeft = to;
        return;
      }
      // easeOutCubic starts at 3 × average speed, so pick the duration that
      // matches the release velocity (px/ms) — clamped to a calm range.
      const speed = Math.abs(velocity);
      const duration = Math.min(
        650,
        Math.max(380, speed > 0.05 ? (3 * Math.abs(distance)) / speed : 520),
      );
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        row.scrollLeft = from + distance * eased;
        animation.current = t < 1 ? requestAnimationFrame(step) : 0;
      };
      animation.current = requestAnimationFrame(step);
    },
    [stopAnimation],
  );

  /** Mobile only: scroll so card `index` is in place (first left, last right, rest centred). */
  const goTo = useCallback(
    (index: number, { smooth = true, velocity = 0 } = {}) => {
      const row = rowRef.current;
      if (!row) return;
      const cards = getCards(row);
      if (cards.length === 0) return;
      const target = Math.max(0, Math.min(cards.length - 1, index));
      const left = targetLeft(row, cards, target);
      if (smooth) animateTo(row, left, velocity);
      else {
        stopAnimation();
        row.scrollLeft = left;
      }
      setCurrent(target);
    },
    [animateTo, stopAnimation],
  );

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    stopAnimation();
    row.scrollLeft = 0;
    setCurrent(0);
    updateArrows();
    // Re-align only when the width changes (rotation, resize). Height changes
    // come from the active card growing and must not interrupt the animation.
    let width = row.clientWidth;
    const observer = new ResizeObserver(() => {
      updateArrows();
      if (row.clientWidth === width) return;
      width = row.clientWidth;
      if (isMobile()) goTo(currentRef.current, { smooth: false });
    });
    observer.observe(row);
    return () => observer.disconnect();
  }, [activeId, updateArrows, goTo, stopAnimation]);

  // Mobile: one card per swipe, whatever the swipe speed.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    let drag: { id: number; x: number; y: number; left: number; index: number; t: number } | null =
      null;
    let dragging = false;
    let suppressClick = false;
    // Recent pointer positions, to measure the speed at release.
    let samples: { x: number; t: number }[] = [];

    const onDown = (e: PointerEvent) => {
      if (!isMobile() || e.pointerType === "mouse") return;
      // Catch the row mid-animation and continue from where it is.
      stopAnimation();
      samples = [{ x: e.clientX, t: e.timeStamp }];
      drag = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        left: row.scrollLeft,
        index: currentRef.current,
        t: e.timeStamp,
      };
      dragging = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!dragging) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - drag.y)) return;
        dragging = true;
        row.setPointerCapture(e.pointerId);
      }
      samples.push({ x: e.clientX, t: e.timeStamp });
      if (samples.length > 8) samples.shift();
      // Follow the finger 1:1 up to one card; beyond that it gets heavier, so a
      // hard swipe doesn't overshoot the next card and then pull back.
      const cards = getCards(row);
      const neighbour = drag.index + (dx < 0 ? 1 : -1);
      const limit =
        neighbour >= 0 && neighbour < cards.length
          ? Math.abs(targetLeft(row, cards, neighbour) - drag.left)
          : 0; // no card that way: resist right away
      const pull = Math.abs(dx);
      const eased = pull <= limit ? pull : limit + (pull - limit) * 0.2;
      row.scrollLeft = drag.left - Math.sign(dx) * eased;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { index } = drag;
      if (dragging) {
        // Use the last real finger positions; the pointerup coordinates are unreliable.
        const last = samples[samples.length - 1] ?? { x: drag.x, t: drag.t };
        const dx = last.x - drag.x;
        // Speed over the last ~100ms of movement (px/ms, positive = to the right).
        // A finger that rested before lifting has no speed.
        const recent = samples.filter((p) => last.t - p.t <= 100);
        const first = recent[0] ?? last;
        const velocity =
          e.timeStamp - last.t > 120 || last.t === first.t
            ? 0
            : (last.x - first.x) / (last.t - first.t);
        // Far enough (a quarter card) or a quick flick → next/previous card, else snap back.
        const card = getCards(row)[index];
        const threshold = card ? card.offsetWidth * 0.25 : 60;
        const step =
          dx < -threshold || velocity < -0.35 ? 1 : dx > threshold || velocity > 0.35 ? -1 : 0;
        goTo(index + step, { velocity });
        // The click that follows this pointerup belongs to the swipe, not a tap.
        suppressClick = true;
        setTimeout(() => (suppressClick = false), 0);
      }
      drag = null;
      dragging = false;
    };
    const onCancel = () => {
      if (drag && dragging) goTo(drag.index);
      samples = [];
      drag = null;
      dragging = false;
    };
    // A dragged card shouldn't also count as a tap.
    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Trackpad / mouse wheel: one card per gesture (momentum events are ignored).
    let wheelLocked = false;
    let wheelTimer = 0;
    const onWheel = (e: WheelEvent) => {
      if (!isMobile() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => (wheelLocked = false), 200);
      if (wheelLocked || Math.abs(e.deltaX) < 4) return;
      wheelLocked = true;
      goTo(currentRef.current + Math.sign(e.deltaX));
    };

    row.addEventListener("pointerdown", onDown);
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerup", onUp);
    row.addEventListener("pointercancel", onCancel);
    row.addEventListener("click", onClick, true);
    row.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      clearTimeout(wheelTimer);
      row.removeEventListener("pointerdown", onDown);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerup", onUp);
      row.removeEventListener("pointercancel", onCancel);
      row.removeEventListener("click", onClick, true);
      row.removeEventListener("wheel", onWheel);
    };
  }, [goTo, stopAnimation]);

  const move = (direction: -1 | 1) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.querySelector<HTMLElement>(":scope > div > a");
    const step = card ? card.offsetWidth + 16 : row.clientWidth * 0.8;
    row.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Onze verhalen"
      className="w-full bg-white px-4 py-3 sm:px-6 lg:px-10 xl:px-0"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4">
        <h2
          className="border-t-4 border-[#202223] pt-5 font-['Roboto:Bold'] text-[14px] leading-[1.15] font-bold text-[#202223] uppercase"
          style={roboto}
        >
          Onze Verhalen
        </h2>

        <div
          role="group"
          aria-label="Categorieën"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((category) => {
            const selected = category.id === activeId;
            return (
              <button
                key={category.id}
                type="button"
                data-home-pill={category.id}
                aria-pressed={category.inline ? selected : undefined}
                aria-controls={category.inline ? "story-row" : undefined}
                aria-haspopup={category.inline ? undefined : "dialog"}
                onClick={(event) =>
                  category.inline
                    ? setActiveId(category.id)
                    : openFeed(category.id, event.currentTarget)
                }
                className={`shrink-0 rounded-full px-3 py-2 font-['Roboto:Medium'] text-[14px] leading-4 font-medium whitespace-nowrap text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2766f5] ${
                  selected ? "bg-[#2766f5]" : "bg-[rgba(0,0,0,0.27)] hover:bg-[rgba(0,0,0,0.45)]"
                }`}
                style={roboto}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div
          id="story-row"
          ref={rowRef}
          // Mobile: fixed row height (= active card), so cards growing and
          // shrinking never move the content below.
          style={{ ["--card-w" as string]: mobileCard }}
          onScroll={onRowScroll}
          onFocus={(event) => {
            if (!isMobile()) return;
            const index = getCards(event.currentTarget).indexOf(event.target as HTMLElement);
            if (index >= 0 && index !== currentRef.current) goTo(index);
          }}
          className="relative -mx-4 flex h-[calc(var(--card-w)*9/5)] touch-pan-y items-center gap-4 overflow-x-hidden px-4 select-none sm:h-auto sm:touch-auto sm:items-stretch sm:snap-x sm:snap-mandatory sm:scroll-px-4 sm:overflow-x-auto sm:scroll-smooth sm:select-auto [scrollbar-width:none] [&_img]:pointer-events-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {active.stories.map((story, i) => (
            <div
              key={`${active.id}-${story.id}`}
              className="contents [&>a]:animate-[teaser-in_400ms_ease-out_both]"
              style={{ ["--delay" as string]: `${i * 60}ms` }}
            >
              <Teaser
                story={story}
                active={i === current}
                snap={i === 0 ? "start" : i === active.stories.length - 1 ? "end" : "center"}
              />
            </div>
          ))}
        </div>

        <div className="hidden justify-end sm:flex">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label="Vorige verhalen"
            className="flex size-8 items-center justify-center rounded-full transition-opacity hover:bg-black/5 disabled:cursor-default disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <img alt="" className="size-4" src={asset("36810.svg")} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label="Volgende verhalen"
            className="flex size-8 items-center justify-center rounded-full transition-opacity hover:bg-black/5 disabled:cursor-default disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <img alt="" className="size-4" src={asset("e7a98.svg")} />
          </button>
        </div>
      </div>
    </section>
  );
}
