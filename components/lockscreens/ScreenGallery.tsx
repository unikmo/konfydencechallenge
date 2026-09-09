"use client";

import { useCallback, useEffect, useState } from "react";

export type GalleryTier = {
  name: string;
  blurb: string;
  frame: "phone" | "desktop";
  shots: string[];
};

type Lightbox = { tier: number; shot: number } | null;

export function ScreenGallery({ tiers }: { tiers: GalleryTier[] }) {
  const [box, setBox] = useState<Lightbox>(null);

  const close = useCallback(() => setBox(null), []);
  const move = useCallback(
    (delta: number) => {
      setBox((cur) => {
        if (!cur) return cur;
        const shots = tiers[cur.tier].shots;
        const next = (cur.shot + delta + shots.length) % shots.length;
        return { ...cur, shot: next };
      });
    },
    [tiers]
  );

  useEffect(() => {
    if (!box) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [box, close, move]);

  const active = box ? tiers[box.tier].shots[box.shot] : null;
  const activeFrame = box ? tiers[box.tier].frame : "desktop";

  return (
    <>
      <div className="kls-galleries">
        {tiers.map((tier, ti) => (
          <article className={`kls-gallery is-${tier.frame}`} key={tier.name}>
            <header>
              <h3>{tier.name}</h3>
              <p>{tier.blurb}</p>
            </header>

            {tier.frame === "desktop" ? (
              <div className="kls-gallery-desktop">
                <button
                  type="button"
                  className="kls-shot-desktop is-lead"
                  onClick={() => setBox({ tier: ti, shot: 0 })}
                  aria-label={`Enlarge ${tier.name} lock screen 1`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tier.shots[0]} alt={`${tier.name} Konfydence lock screen`} loading="lazy" />
                </button>
                <div className="kls-thumbs">
                  {tier.shots.slice(1).map((src, i) => (
                    <button
                      type="button"
                      className="kls-shot-desktop"
                      key={src}
                      onClick={() => setBox({ tier: ti, shot: i + 1 })}
                      aria-label={`Enlarge ${tier.name} lock screen ${i + 2}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${tier.name} Konfydence lock screen ${i + 2}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="kls-gallery-phone">
                {tier.shots.map((src, i) => (
                  <button
                    type="button"
                    className="kls-shot-phone"
                    key={src}
                    onClick={() => setBox({ tier: ti, shot: i })}
                    aria-label={`Enlarge ${tier.name} lock screen ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${tier.name} Konfydence lock screen ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {active ? (
        <div className="kls-lightbox" role="dialog" aria-modal="true" aria-label="Lock screen preview" onClick={close}>
          <button type="button" className="kls-lightbox-close" onClick={close} aria-label="Close preview">×</button>
          <button
            type="button"
            className="kls-lightbox-nav is-prev"
            onClick={(e) => { e.stopPropagation(); move(-1); }}
            aria-label="Previous"
          >
            ‹
          </button>
          <figure className={`kls-lightbox-figure is-${activeFrame}`} onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active} alt="Konfydence lock screen, full size" />
          </figure>
          <button
            type="button"
            className="kls-lightbox-nav is-next"
            onClick={(e) => { e.stopPropagation(); move(1); }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      ) : null}
    </>
  );
}
