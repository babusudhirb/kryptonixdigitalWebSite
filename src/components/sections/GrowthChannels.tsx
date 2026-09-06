"use client";

import Image from "next/image";
import { ArrowRight, Check, TrendingDown, TrendingUp } from "lucide-react";
import { ads, automation, seo } from "@/content/site";
import { Icon } from "@/components/ui/Icons";
import { FlowSteps } from "@/components/ui/FlowSteps";
import { Reveal } from "@/components/ui/Reveal";
import { useDialog } from "@/components/ui/DialogProvider";
import styles from "./GrowthChannels.module.css";

/**
 * SEO · Paid Ads · AI Automation.
 * The reference lays these out as three cards in one row rather than three
 * full-width sections, so each card is its own <section> inside the grid —
 * keeping #seo / #ads / #automation crawlable and anchor-linkable.
 */
export function GrowthChannels() {
  const { open } = useDialog();

  return (
    <div className={`kx-section ${styles.band}`}>
      <div className={`kx-container ${styles.grid}`}>
        {/* ---------------- SEO ---------------- */}
        <Reveal
          as="section"
          id="seo"
          className={`${styles.card} ${styles.seo}`}
          aria-labelledby="seo-title"
        >
          <div className={styles.copy}>
            <p className="kx-badge">{seo.badge}</p>
            <h2 id="seo-title" className={styles.title}>
              {seo.headline[0]}
              <br />
              {seo.headline[1]}
            </h2>
            <p className={styles.lead}>{seo.lead}</p>

            <ul className={styles.pillars}>
              {seo.pillars.map((p) => (
                <li key={p.title}>
                  <span className="kx-tile kx-tile--lav">
                    <Icon name={p.icon} size={19} strokeWidth={1.9} />
                  </span>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                  <p className={styles.pillarBody}>{p.body}</p>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => open("lead")}
              className={`kx-btn kx-btn--sm kx-btn--violet ${styles.cta}`}
            >
              {seo.cta}
              <ArrowRight size={16} className="kx-arrow" aria-hidden="true" />
            </button>
          </div>

          <div className={`${styles.person} ${styles.personSeo}`}>
            <Image
              src="/assets/seo-specialist.png"
              alt={seo.imageAlt}
              width={565}
              height={740}
              sizes="(max-width: 1200px) 40vw, 300px"
              className={styles.personImage}
            />
          </div>
        </Reveal>

        {/* ---------------- Paid ads ---------------- */}
        <Reveal
          as="section"
          id="ads"
          className={`${styles.card} ${styles.ads}`}
          aria-labelledby="ads-title"
          delay={90}
        >
          <div className={styles.copy}>
            <p className="kx-badge kx-badge--pink">{ads.badge}</p>
            <h2 id="ads-title" className={styles.title}>
              {ads.headline[0]}
              <br />
              Get <span className="kx-accent-violet">Real Results.</span>
            </h2>
            <p className={styles.lead}>{ads.lead}</p>

            <div className={styles.flowWrap}>
              <FlowSteps
                steps={ads.journey}
                tone="pink"
                label="How paid ad spend turns into revenue"
              />
            </div>

            <ul className={styles.optimise} aria-label="What every campaign is optimised for">
              {ads.optimise.map((m) => (
                <li key={m.label}>
                  <span className={styles.optimiseLabel}>{m.label}</span>
                  <span
                    className={`${styles.optimiseTrend} ${
                      m.trend === "up" ? styles.trendUp : styles.trendDown
                    }`}
                  >
                    {m.trend === "up" ? (
                      <TrendingUp size={13} strokeWidth={2.4} aria-hidden="true" />
                    ) : (
                      <TrendingDown size={13} strokeWidth={2.4} aria-hidden="true" />
                    )}
                    {m.note}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => open("lead")}
              className={`kx-btn kx-btn--sm kx-btn--pink ${styles.cta}`}
            >
              {ads.cta}
              <ArrowRight size={16} className="kx-arrow" aria-hidden="true" />
            </button>
          </div>

          <div className={`${styles.person} ${styles.personAds}`}>
            <Image
              src="/assets/ads-specialist.png"
              alt={ads.imageAlt}
              width={591}
              height={728}
              sizes="(max-width: 1200px) 40vw, 300px"
              className={styles.personImage}
            />
          </div>
        </Reveal>

        {/* ---------------- AI automation ---------------- */}
        <Reveal
          as="section"
          id="automation"
          className={`${styles.card} ${styles.automation}`}
          aria-labelledby="automation-title"
          delay={180}
        >
          <div className={styles.copy}>
            <p className="kx-badge">{automation.badge}</p>
            <h2 id="automation-title" className={styles.title}>
              {automation.headline[0]}
              <br />
              Run on <span className="kx-accent-violet">Autopilot.</span>
            </h2>
            <p className={styles.lead}>{automation.lead}</p>

            <div className={styles.flowWrap}>
              <FlowSteps
                steps={automation.flow}
                tone="violet"
                label="How an incoming lead is automated end to end"
              />
            </div>

            <ul className={styles.outcomes}>
              {automation.outcomes.map((o) => (
                <li key={o}>
                  <span className={styles.outcomeCheck}>
                    <Check size={10} strokeWidth={3.5} aria-hidden="true" />
                  </span>
                  {o}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => open("lead")}
              className={`kx-btn kx-btn--sm kx-btn--violet ${styles.cta}`}
            >
              {automation.cta}
              <ArrowRight size={16} className="kx-arrow" aria-hidden="true" />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
