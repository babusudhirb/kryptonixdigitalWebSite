"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { primaryCta, services, servicesHead } from "@/content/site";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceVisual } from "@/components/graphics/ServiceVisual";
import { useDialog } from "@/components/ui/DialogProvider";
import styles from "./Services.module.css";

/** Three per page, so all six are covered in two swipes on a phone. */
const PER_PAGE = 3;
const pages = Array.from({ length: Math.ceil(services.length / PER_PAGE) }, (_, i) =>
  services.slice(i * PER_PAGE, i * PER_PAGE + PER_PAGE),
);

export function Services() {
  const { open } = useDialog();

  return (
    <section className="kx-section" id="services" aria-labelledby="services-title">
      <div className="kx-container">
        <Reveal className={styles.head}>
          <p className={`kx-badge ${styles.badge}`}>{servicesHead.badge}</p>
          <h2 id="services-title" className={styles.title}>
            {servicesHead.headline[0]}{" "}
            <span className={styles.titleAccent}>{servicesHead.headline[1]}</span>
          </h2>
          <p className={styles.lead}>{servicesHead.lead}</p>
        </Reveal>

        {/* ---- Desktop / tablet: the full 3 x 2 card grid ---- */}
        <ul className={styles.grid}>
          {services.map((s, i) => (
            <Reveal
              as="li"
              key={s.num}
              className={`${styles.card} ${s.tone === "pink" ? styles.pink : styles.lav}`}
              delay={(i % 3) * 80}
            >
              <div className={styles.well}>
                <ServiceVisual kind={s.visual} className={styles.visual} />
                <span className={styles.num}>{s.num}</span>
              </div>

              <div className={styles.cardBody}>
                <span className={`kx-tile kx-tile--${s.tone} ${styles.tile}`}>
                  <Icon name={s.icon} size={24} strokeWidth={1.9} />
                </span>

                <h3 className={styles.cardTitle}>
                  {s.title[0]}
                  <br />
                  {s.title[1]}
                </h3>
                <p className={styles.body}>{s.body}</p>

                <ul className={styles.points}>
                  {s.points.map((p) => (
                    <li key={p}>
                      <span className={styles.check}>
                        <Check size={10} strokeWidth={3.6} aria-hidden="true" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => open("lead")}
                  className={`kx-btn kx-btn--sm ${
                    s.tone === "pink" ? "kx-btn--pink" : "kx-btn--violet"
                  } ${styles.cta}`}
                >
                  {s.cta}
                  <ArrowRight size={16} className="kx-arrow" aria-hidden="true" />
                </button>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* ---- Phone: two snap pages of three ---- */}
        <Carousel />

        <div className={styles.footCta}>
          <button type="button" className="kx-btn kx-btn--pink" onClick={() => open("lead")}>
            {primaryCta.label}
            <ArrowRight size={18} className="kx-arrow" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  /* Keep the dots in step with however the track was scrolled — swipe,
     trackpad, or the dots themselves. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(Number((visible.target as HTMLElement).dataset.page));
      },
      { root: track, threshold: [0.5, 0.75] },
    );

    track.querySelectorAll<HTMLElement>("[data-page]").forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={styles.carousel}>
      <div
        ref={trackRef}
        className={styles.track}
        role="group"
        aria-roledescription="carousel"
        aria-label="Our services"
        tabIndex={0}
      >
        {pages.map((page, pi) => (
          <div
            key={pi}
            data-page={pi}
            className={styles.page}
            role="group"
            aria-roledescription="slide"
            aria-label={`Services ${pi * PER_PAGE + 1} to ${pi * PER_PAGE + page.length} of ${
              services.length
            }`}
          >
            {page.map((s) => (
              <article
                key={s.num}
                className={`${styles.mini} ${s.tone === "pink" ? styles.pink : styles.lav}`}
              >
                <span className={`kx-tile kx-tile--${s.tone} ${styles.miniTile}`}>
                  <Icon name={s.icon} size={22} strokeWidth={1.9} />
                </span>
                <div className={styles.miniCopy}>
                  <h3 className={styles.miniTitle}>
                    {s.title[0]} {s.title[1]}
                  </h3>
                  <p className={styles.miniBody}>{s.body}</p>
                  <ul className={styles.chips}>
                    {s.points.slice(0, 2).map((p) => (
                      <li key={p}>
                        <Check size={10} strokeWidth={3.6} aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {pages.map((page, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === current ? styles.dotOn : ""}`}
            aria-label={`Show services ${i * PER_PAGE + 1} to ${i * PER_PAGE + page.length}`}
            aria-current={i === current ? "true" : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
