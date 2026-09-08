"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { serviceChips, services, servicesHead } from "@/content/site";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useDialog } from "@/components/ui/DialogProvider";
import { useTilt } from "@/components/ui/useTilt";
import styles from "./Services.module.css";

/**
 * True once we know we are on a phone. Starts `false` so the server and the
 * first client render agree; the collapse itself is pure CSS, so the panels are
 * already hidden at that width before this resolves — this only keeps
 * `aria-expanded` and the tab order honest.
 */
function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return compact;
}

export function Services() {
  const { open } = useDialog();
  const tilt = useTilt();
  const compact = useCompact();
  /* Phones only: which compact card is expanded. Above 760px every panel is
     open, so this is never read. */
  const [openCard, setOpenCard] = useState<string | null>(null);

  return (
    <section className="kx-section" id="services" aria-labelledby="services-title">
      <div className="kx-container">
        <Reveal className={styles.head}>
          <p className={`kx-badge ${styles.badge}`}>{servicesHead.badge}</p>
          <h2 id="services-title" className={styles.title}>
            {servicesHead.headline[0]}{" "}
            <span className={styles.accentViolet}>{servicesHead.headline[1]}</span>{" "}
            <span className={styles.accentPink}>{servicesHead.headline[2]}</span>
          </h2>
          <p className={styles.lead}>{servicesHead.lead}</p>
        </Reveal>

        {/* Banner illustration. The heading above and every service label below
            are live text, so only the artwork is raster. Two crops of the two
            supplied boards, one per breakpoint: a wide 2.33:1 band on desktop
            and the taller phone composition below 760px. Only one is ever laid
            out, so the other costs no bytes — `sizes` is `0px` on the hidden
            one and the browser skips its download. Both are height-bounded and
            edge-faded in CSS so they read as part of the section rather than a
            rectangle laid on top of it. */}
        <Reveal className={styles.banner}>
          <Image
            src="/assets/services-banner-desktop.png"
            alt={servicesHead.bannerAlt}
            width={1774}
            height={672}
            sizes="(max-width: 760px) 0px, 1216px"
            className={`${styles.bannerImage} ${styles.bannerWide}`}
            /* Faces and small baked labels; the default 75 softens both. */
            quality={88}
            priority={false}
          />
          {/* Same alt on both: only one is ever laid out, and `display: none`
              keeps the other out of the accessibility tree, so it is announced
              exactly once at every width. */}
          <Image
            src="/assets/services-banner.png"
            alt={servicesHead.bannerAlt}
            width={1199}
            height={842}
            sizes="(max-width: 760px) 100vw, 0px"
            className={`${styles.bannerImage} ${styles.bannerPhone}`}
            quality={88}
            priority={false}
          />
        </Reveal>

        <ul className={styles.grid}>
          {services.map((s, i) => {
            const panelId = `svc-panel-${s.num}`;
            /* Desktop panels are always open, so the control reports that. */
            const expanded = compact ? openCard === s.num : true;
            return (
              <Reveal
                as="li"
                key={s.num}
                className={`${styles.card} ${s.tone === "pink" ? styles.pink : styles.lav} ${
                  openCard === s.num ? styles.cardOpen : ""
                }`}
                delay={(i % 3) * 80}
                {...tilt}
              >
                <div className={styles.cardHead}>
                  <span className={styles.num}>{s.num}</span>
                  <span className={`${styles.tile} ${s.tone === "pink" ? styles.tilePink : ""}`}>
                    <Icon name={s.icon} size={26} strokeWidth={1.9} />
                  </span>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.titleFull}>
                      {s.title[0]}
                      <br />
                      {s.title[1]}
                    </span>
                    {/* Phones only: the compact card's title. Plain text, never
                        a control — see the toggle below. */}
                    <span className={styles.titleShort}>{serviceChips[i].label}</span>
                  </h3>
                </div>

                {/* Phones only, and the ONLY thing that opens or closes a card:
                    a dedicated chevron button, not the heading and not an
                    overlay stretched across the card. `display: none` above
                    760px, where every panel is open, so it adds no tab stop and
                    no extra node to the accessibility tree there. */}
                <button
                  type="button"
                  className={styles.toggle}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  aria-label={`${expanded ? "Hide" : "Show"} details for ${serviceChips[i].label}`}
                  tabIndex={compact ? 0 : -1}
                  onClick={() => setOpenCard(openCard === s.num ? null : s.num)}
                >
                  <ChevronRight size={18} className={styles.chevron} aria-hidden="true" />
                </button>

                <p className={styles.short}>{s.short}</p>

                <div id={panelId} className={styles.panel}>
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
                    className={`kx-btn kx-btn--sm kx-btn--grad ${styles.cta}`}
                  >
                    {s.cta}
                    <ArrowRight size={16} className="kx-arrow" aria-hidden="true" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
