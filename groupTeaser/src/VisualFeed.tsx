import { useCallback, useEffect, useRef, useState } from "react";

import { CATEGORIES, asset } from "./stories";
import "./visual-feed.css";

const feedAsset = (file: string) => asset(`feed/${file}`);

const navItems = [
  { label: "Home", icon: "64e47.svg" },
  { label: "De krant", icon: "113e1.svg" },
  { label: "Luister", icon: "a1476.svg" },
  { label: "Kijk", icon: "a5853.svg" },
  { label: "Menu", icon: "00a9c.svg" },
];

const topicImages = ["bac49.png", "5e901.png", "6d74e.png", "f8fab.png"];

function Topics() {
  return (
    <div className="vf-topics">
      <div className="vf-topic-faces" aria-hidden="true">
        {topicImages.map((image) => (
          <img key={image} src={feedAsset(image)} alt="" />
        ))}
      </div>
      <span>4 onderwerpen</span>
    </div>
  );
}

function IconButton({
  icon,
  label,
  pressed,
  onClick,
}: {
  icon: string;
  label: string;
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="vf-icon-button"
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <img src={feedAsset(icon)} alt="" />
    </button>
  );
}

export default function VisualFeed({
  categoryId,
  onSelectCategory,
  onClose,
}: {
  categoryId: string;
  onSelectCategory: (id: string) => void;
  onClose: () => void;
}) {
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const stories = category.stories;
  const [storyIndex, setStoryIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(false);
  const touchStart = useRef<number | null>(null);
  const activePill = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const story = stories[storyIndex] ?? stories[0];
  const detailed = Boolean(story?.intro || story?.author);

  useEffect(() => {
    // Center the active pill inside the pill row only (scrollIntoView would also
    // scroll the overflow-hidden feed container and shift the layout).
    const pill = activePill.current;
    const list = pill?.parentElement;
    if (pill && list) list.scrollLeft = pill.offsetLeft - (list.clientWidth - pill.offsetWidth) / 2;
  }, [categoryId]);

  const moveStory = useCallback(
    (direction: number) => {
      if (stories.length === 0) return;
      setStoryIndex((current) => (current + direction + stories.length) % stories.length);
    },
    [stories.length],
  );

  // Move focus into the dialog on open and hand it back on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    backButton.current?.focus({ preventScroll: true });
    return () => {
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Escape") onCloseRef.current();
      else if (event.key === "ArrowRight" || event.key === "ArrowDown") moveStory(1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") moveStory(-1);
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveStory]);

  const shareStory = async () => {
    if (!story) return;
    const shareData = { title: story.title, url: window.location.href };
    if (navigator.share) await navigator.share(shareData).catch(() => undefined);
    else await navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <div
      className="visual-feed"
      role="dialog"
      aria-modal="true"
      aria-label={`Visual feed: ${category.label}`}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientY;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = touchStart.current - event.changedTouches[0].clientY;
        if (Math.abs(distance) > 45) moveStory(distance > 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      {story ? (
        <>
          <div className="vf-ambient" aria-hidden="true" key={`amb-${story.id}`}>
            {story.image && <img src={story.image} alt="" />}
            <span />
          </div>
          <button
            className="vf-story-image"
            type="button"
            onClick={() => moveStory(1)}
            aria-label="Volgend verhaal"
          >
            {story.image ? (
              <img
                key={story.id}
                src={story.image}
                alt=""
                style={{ objectPosition: story.focus ?? "center" }}
              />
            ) : (
              <span className="vf-no-image" key={story.id} />
            )}
          </button>
        </>
      ) : (
        <div className="vf-empty">
          <p className="vf-empty-title">Nog geen verhalen in {category.label}</p>
          <p className="vf-empty-copy">
            Kies een ander onderwerp hierboven of keer terug naar de voorpagina.
          </p>
          <button type="button" onClick={onClose}>
            Terug naar de voorpagina
          </button>
        </div>
      )}

      <header className="vf-header">
        <div className="vf-header-row">
          <button
            ref={backButton}
            type="button"
            className="vf-back"
            onClick={onClose}
            aria-label="Terug naar de voorpagina"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <nav className="vf-category-list" aria-label="Onderwerpen">
            {CATEGORIES.map((item) => {
              const active = item.id === category.id;
              return (
                <button
                  key={item.id}
                  ref={active ? activePill : undefined}
                  type="button"
                  className={active ? "active" : ""}
                  aria-current={active ? "page" : undefined}
                  style={active ? { viewTransitionName: "feed-pill" } : undefined}
                  onClick={() => !active && onSelectCategory(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {story?.author && (
          <button
            className="vf-type-marker"
            type="button"
            aria-label={`${story.author.kind} van ${story.author.name}`}
          >
            <img src={story.author.avatar} alt="" />
            <span>
              <strong>{story.author.kind}</strong>
              <small>{story.author.name}</small>
            </span>
          </button>
        )}
      </header>

      {story && (
        <>
          <section className="vf-story-controls" aria-label="Verhaalbediening">
            <div
              className="vf-story-index"
              aria-label={`Verhaal ${storyIndex + 1} van ${stories.length}`}
            >
              {stories.map((s, index) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Ga naar verhaal ${index + 1}`}
                  className={index === storyIndex ? "current" : ""}
                  onClick={() => setStoryIndex(index)}
                >
                  {index === storyIndex && <i onAnimationEnd={() => moveStory(1)} />}
                </button>
              ))}
            </div>
            <div className="vf-utility-menu">
              <IconButton
                icon="95262.svg"
                label={liked ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
                pressed={liked}
                onClick={() => setLiked((value) => !value)}
              />
              <IconButton icon="27290.svg" label="Deel dit verhaal" onClick={shareStory} />
              <IconButton
                icon="4e678.svg"
                label={muted ? "Zet geluid aan" : "Zet geluid uit"}
                pressed={muted}
                onClick={() => setMuted((value) => !value)}
              />
            </div>
          </section>
        </>
      )}

      <div className={`vf-bottom ${detailed ? "detailed" : "compact"}`}>
        {story && detailed && (
          <div className="vf-watch-progress" aria-hidden="true">
            <span key={story.id} />
          </div>
        )}

        {story && (
          <article className="vf-teaser" key={story.id}>
            <div className="vf-teaser-copy">
              {story.label && <strong className="vf-story-label">{story.label}</strong>}
              <h1>{story.title}</h1>
              {story.intro && <p>{story.intro}</p>}
              <Topics />
            </div>
            <button className="vf-open-story" type="button" aria-label="Open verhaal">
              <img src={feedAsset("1a91f.svg")} alt="" />
            </button>
          </article>
        )}

        <nav className="vf-bottom-nav" aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={item.label === "Kijk" ? "active" : ""}
              onClick={item.label === "Home" ? onClose : undefined}
            >
              <img src={feedAsset(item.icon)} alt="" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
