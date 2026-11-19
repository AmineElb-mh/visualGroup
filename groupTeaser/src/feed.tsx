import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import VisualFeed from "./VisualFeed";
import { CATEGORIES } from "./stories";

const feedIdFromHash = () => {
  const id = location.hash.match(/^#feed\/(.+)$/)?.[1];
  return id && CATEGORIES.some((c) => c.id === id) ? id : null;
};

type TransitionKind = "open" | "close" | "switch";

const PILL_NAME = "feed-pill";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/**
 * Runs a DOM update inside a View Transition (when supported). The clicked
 * pill gets a shared `view-transition-name` so it morphs into its place in the
 * feed while the feed itself is revealed from the click position.
 */
function runTransition(kind: TransitionKind, update: () => void, origin?: HTMLElement | null) {
  const doc = document as ViewTransitionDocument;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduced) {
    update();
    return;
  }

  const root = document.documentElement;
  if (origin) {
    const rect = origin.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);
    origin.style.viewTransitionName = PILL_NAME;
  }
  root.dataset.vt = kind;

  const transition = doc.startViewTransition(() => {
    if (origin) origin.style.viewTransitionName = "";
    flushSync(update);
  });
  transition.finished.finally(() => {
    delete root.dataset.vt;
    document
      .querySelectorAll<HTMLElement>("[data-home-pill]")
      .forEach((pill) => (pill.style.viewTransitionName = ""));
  });
}

type FeedContextValue = {
  openFeed: (categoryId: string, origin: HTMLElement) => void;
};

const FeedContext = createContext<FeedContextValue | null>(null);

export function useFeed() {
  const value = useContext(FeedContext);
  if (!value) throw new Error("useFeed must be used inside <FeedProvider>");
  return value;
}

export function FeedProvider({ children }: { children: ReactNode }) {
  const [feedCategory, setFeedCategory] = useState<string | null>(null);
  const currentRef = useRef(feedCategory);
  currentRef.current = feedCategory;

  const openFeed = useCallback((categoryId: string, origin: HTMLElement) => {
    history.pushState({ feed: categoryId }, "", `#feed/${categoryId}`);
    runTransition("open", () => setFeedCategory(categoryId), origin);
  }, []);

  const closeFeed = useCallback((categoryId: string) => {
    runTransition("close", () => {
      setFeedCategory(null);
      // Hand the shared pill name back to the matching pill on the homepage.
      const homePill = document.querySelector<HTMLElement>(`[data-home-pill="${categoryId}"]`);
      if (homePill) {
        const rect = homePill.getBoundingClientRect();
        const root = document.documentElement;
        root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
        root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);
        homePill.style.viewTransitionName = PILL_NAME;
      }
    });
  }, []);

  const switchCategory = useCallback((categoryId: string) => {
    history.replaceState({ feed: categoryId }, "", `#feed/${categoryId}`);
    runTransition("switch", () => setFeedCategory(categoryId));
  }, []);

  // Browser back button closes the feed; a deep link (#feed/id) opens it.
  useEffect(() => {
    const fromHash = feedIdFromHash();
    if (fromHash) setFeedCategory(fromHash);

    const onPop = (event: PopStateEvent) => {
      const target =
        (event.state as { feed?: string } | null)?.feed ?? feedIdFromHash();
      const current = currentRef.current;
      if (!target && current) closeFeed(current);
      else if (target) setFeedCategory(target);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [closeFeed]);

  // Lock page scroll underneath the feed.
  useEffect(() => {
    document.documentElement.classList.toggle("feed-open", feedCategory !== null);
  }, [feedCategory]);

  const requestClose = () => {
    if ((history.state as { feed?: string } | null)?.feed) history.back();
    else if (feedCategory) {
      history.replaceState(null, "", location.pathname + location.search);
      closeFeed(feedCategory);
    }
  };

  return (
    <FeedContext.Provider value={{ openFeed }}>
      {children}
      {feedCategory && (
        <VisualFeed
          key={feedCategory}
          categoryId={feedCategory}
          onSelectCategory={switchCategory}
          onClose={requestClose}
        />
      )}
    </FeedContext.Provider>
  );
}
