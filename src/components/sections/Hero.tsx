"use client";

import Image from "next/image";
import { ArrowRight, Check, Play } from "lucide-react";
import { hero, primaryCta } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { useDialog } from "@/components/ui/DialogProvider";
import styles from "./Hero.module.css";

export function Hero() {
  const { open } = useDialog();

  return (
    <section className={styles.hero} id="top">
      <div className={`kx-container ${styles.grid}`}>
        <Reveal className={styles.copy}>
          <p className="kx-badge">{hero.badge}</p>

          <h1 className={styles.headline}>
            <span>{hero.headline[0]}</span>
            <span>{hero.headline[1]}</span>
            <span className={styles.accent}>{hero.headline[2]}</span>
          </h1>

          <p className={styles.lead}>{hero.lead}</p>

          <div className={styles.ctas}>
            <button type="button" className="kx-btn kx-btn--pink" onClick={() => open("lead")}>
              {primaryCta.label}
              <ArrowRight size={18} className="kx-arrow" aria-hidden="true" />
            </button>
            <a href={hero.secondaryCta.href} className="kx-btn kx-btn--ghost">
              <span className={styles.play}>
                <Play size={9} fill="currentColor" aria-hidden="true" />
              </span>
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className={styles.proof}>
            {hero.proof.map((item) => (
              <li key={item}>
                <span className={styles.check}>
                  <Check size={11} strokeWidth={3.5} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.visual} delay={120}>
          <Image
            src="/assets/hero-orbit.png"
            alt={hero.imageAlt}
            width={1402}
            height={1122}
            priority
            sizes="(max-width: 900px) 94vw, 54vw"
            className={styles.heroImage}
          />
        </Reveal>
      </div>
    </section>
  );
}
