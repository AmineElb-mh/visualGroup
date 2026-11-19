import { useEffect, useRef, useState } from "react";

const assets = `${import.meta.env.BASE_URL}assets`;

const stories = [
  {
    image: `${assets}/2da7c.png`,
    alt: "Portrait of a writer lit in vivid blue, green, red, and orange light",
    detailed: true,
  },
  {
    image: `${assets}/06925.png`,
    alt: "A suited American politician walking through a government building",
    detailed: false,
  },
];

const categories = ["Vandaag", "Basketball", "Amerikaanse Politiek", "Koken", "Achterklap"];

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
    <div className="topics">
      <div className="topic-faces" aria-hidden="true">
        {topicImages.map((image) => (
          <img key={image} src={`${assets}/${image}`} alt="" />
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
      className="icon-button"
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <img src={`${assets}/${icon}`} alt="" />
    </button>
  );
}

export default function App() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [category, setCategory] = useState("Vandaag");
  const [liked, setLiked] = useState(true);
  const [muted, setMuted] = useState(false);
  const [activeNav, setActiveNav] = useState("Kijk");
  const touchStart = useRef<number | null>(null);
  const story = stories[storyIndex];

  const moveStory = (direction: number) => {
    setStoryIndex((current) => (current + direction + stories.length) % stories.length);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") moveStory(1);
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") moveStory(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const shareStory = async () => {
    const shareData = {
      title: "Slagveld-technologie ingezet tegen eigen burgers",
      text: "De nieuwe realiteit in de VS",
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <main
      className="visual-feed"
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
      <div className="ambient" aria-hidden="true">
        <img src={story.image} alt="" />
        <span />
      </div>

      <button
        className="story-image"
        type="button"
        onClick={() => moveStory(1)}
        aria-label="Volgend verhaal"
      >
        <img src={story.image} alt={story.alt} />
      </button>

      <header className="feed-header">
        <nav className="category-list" aria-label="Onderwerpen">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        {story.detailed && (
          <button className="type-marker" type="button" aria-label="Opinie van Anna Kirkegaard">
            <img src={`${assets}/a80c4.png`} alt="" />
            <span>
              <strong>Opinie</strong>
              <small>Anna Kirkegaard</small>
            </span>
          </button>
        )}
      </header>

      <section className="story-controls" aria-label="Verhaalbediening">
        <div className="story-index" aria-label={`Verhaal ${storyIndex + 1} van ${stories.length}`}>
          {stories.map((s, index) => (
            <span key={s.image} className={index === storyIndex ? "current" : ""}>
              {index === storyIndex && <i />}
            </span>
          ))}
        </div>
        <div className="utility-menu">
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

      <div className={`feed-bottom ${story.detailed ? "detailed" : "compact"}`}>
        {story.detailed && (
          <div className="watch-progress" aria-hidden="true">
            <span />
          </div>
        )}

        <article className="story-teaser">
          <div className="teaser-copy">
            {story.detailed ? (
              <>
                <strong className="story-label">Sci-fi Writer</strong>
                <h1>
                  Slagveld-technologie ingezet tegen eigen burgers: De nieuwe realiteit in de VS
                </h1>
                <p>
                  De huidige sciencefiction neigt sterk naar fatalisme, deels omdat een verwoeste
                  wereld makkelijker te verbeelden is dan een complexe, geloofwaardige utopie.
                </p>
                <Topics />
              </>
            ) : (
              <>
                <h1>
                  Slagveld-technologie ingezet tegen eigen burgers: De nieuwe realiteit in de VS
                </h1>
                <Topics />
              </>
            )}
          </div>
          <button className="open-story" type="button" aria-label="Open verhaal">
            <img src={`${assets}/1a91f.svg`} alt="" />
          </button>
        </article>

        <nav className="bottom-nav" aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={activeNav === item.label ? "active" : ""}
              onClick={() => setActiveNav(item.label)}
            >
              <img src={`${assets}/${item.icon}`} alt="" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
