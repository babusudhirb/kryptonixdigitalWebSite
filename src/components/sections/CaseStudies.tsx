"use client";

import { ArrowRight, Wrench } from "lucide-react";
import { caseStudies } from "@/content/site";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useDialog } from "@/components/ui/DialogProvider";
import { useTilt } from "@/components/ui/useTilt";
import styles from "./CaseStudies.module.css";

/**
 * Deliberately quieter than Services and Solutions — tighter padding, no
 * illustration, small icons, plain text links instead of gradient buttons.
 *
 * Nothing here states a finished result. Both products are still being built,
 * so the cards carry a status and an unlabelled progress bar rather than
 * completion figures or client outcomes.
 */
export function CaseStudies() {
  const { open } = useDialog();
  const tilt = useTilt();

  return (
    <section className="kx-section" id="case-studies" aria-labelledby="case-studies-title">
      <div className="kx-container">
        <Reveal className={styles.head}>
          <p className={`kx-badge ${styles.badge}`}>
            <span className={styles.dot} aria-hidden="true" />
            {caseStudies.badge}
          </p>
          <h2 id="case-studies-title" className={styles.title}>
            {caseStudies.headline[0]}{" "}
            <span className={styles.accentViolet}>{caseStudies.headline[1]}</span>{" "}
            <span className={styles.accentPink}>{caseStudies.headline[2]}</span>
          </h2>
          <p className={styles.lead}>{caseStudies.lead}</p>
        </Reveal>

        <ul className={styles.grid}>
          {caseStudies.projects.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              className={styles.card}
              delay={i * 90}
              {...tilt}
            >
              <div className={styles.cardHead}>
                <span className={styles.tile}>
                  <Icon name={p.icon} size={22} strokeWidth={1.9} />
                </span>
                <div className={styles.cardHeadText}>
                  <p className={`${styles.tag} ${p.tone === "pink" ? styles.tagPink : ""}`}>
                    <span className={styles.tagDot} aria-hidden="true" />
                    {p.tag}
                  </p>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                </div>
              </div>

              <p className={styles.body}>{p.body}</p>

              {/* Visual cue only — intentionally unlabelled, because a number
                  here would read as a completion stat we cannot stand behind. */}
              <div className={styles.bar} aria-hidden="true">
                <span style={{ width: `${Math.round(p.progress * 100)}%` }} />
              </div>

              <p className={styles.status}>
                <Wrench size={14} strokeWidth={2} aria-hidden="true" />
                {p.status}
              </p>

              <button type="button" className={styles.link} onClick={() => open("lead")}>
                {caseStudies.link}
                <ArrowRight size={15} className="kx-arrow" aria-hidden="true" />
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
