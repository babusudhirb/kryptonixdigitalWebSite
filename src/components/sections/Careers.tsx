"use client";

import { ArrowRight, Mail } from "lucide-react";
import { careers } from "@/content/site";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useDialog } from "@/components/ui/DialogProvider";
import styles from "./Careers.module.css";

/**
 * Driven entirely by `careers.roles` in content/site.ts: list any number of
 * openings and they render as rows; empty the array and the section falls back
 * to the open-application card. Every path opens the same application form,
 * with the role pre-selected when one was clicked.
 */
export function Careers() {
  const { open } = useDialog();
  const hasRoles = careers.roles.length > 0;

  return (
    <section className="kx-section" id="careers" aria-labelledby="careers-title">
      <div className="kx-container">
        <Reveal className={styles.head}>
          <p className={`kx-badge ${styles.badge}`}>
            <span className={styles.dot} aria-hidden="true" />
            {careers.badge}
          </p>
          <h2 id="careers-title" className={styles.title}>
            {careers.headline[0]}{" "}
            <span className={styles.accentViolet}>{careers.headline[1]}</span>{" "}
            <span className={styles.accentPink}>{careers.headline[2]}</span>
          </h2>
          <p className={styles.lead}>{careers.lead}</p>
        </Reveal>

        <Reveal className={styles.panel}>
          {hasRoles ? (
            <ul className={styles.roles}>
              {careers.roles.map((r) => (
                <li key={r.id} className={styles.role}>
                  <span className={styles.tile}>
                    <Icon name={r.icon} size={22} strokeWidth={1.9} />
                  </span>
                  <div className={styles.roleText}>
                    <h3 className={styles.roleTitle}>{r.title}</h3>
                    <p className={styles.roleBlurb}>{r.blurb}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.apply}
                    onClick={() => open("apply", r.id)}
                  >
                    {careers.apply}
                    <ArrowRight size={15} className="kx-arrow" aria-hidden="true" />
                    <span className="kx-sr-only"> for {r.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <h3 className={styles.roleTitle}>{careers.emptyTitle}</h3>
              <p className={styles.roleBlurb}>{careers.emptyBody}</p>
              <button
                type="button"
                className={`kx-btn kx-btn--sm kx-btn--violet ${styles.emptyCta}`}
                onClick={() => open("apply")}
              >
                {careers.openCta}
                <ArrowRight size={16} className="kx-arrow" aria-hidden="true" />
              </button>
            </div>
          )}

          <ul className={styles.perks}>
            {careers.perks.map((p) => (
              <li key={p.title}>
                <span className={styles.perkIcon}>
                  <Icon name={p.icon} size={24} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className={styles.perkTitle}>{p.title}</h3>
                  <p className={styles.perkBody}>{p.body}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Always present, whether or not roles are open. */}
          <div className={styles.openRow}>
            <span className={styles.mailIcon}>
              <Mail size={17} strokeWidth={2} aria-hidden="true" />
            </span>
            <div className={styles.openText}>
              <h3 className={styles.openTitle}>{careers.openTitle}</h3>
              <p className={styles.openBody}>{careers.openBody}</p>
            </div>
            <button type="button" className={styles.apply} onClick={() => open("apply")}>
              {careers.openCta}
              <ArrowRight size={15} className="kx-arrow" aria-hidden="true" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
