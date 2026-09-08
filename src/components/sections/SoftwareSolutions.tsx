"use client";

import { ArrowRight, Check } from "lucide-react";
import { productCrops, products } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SpriteImage } from "@/components/ui/SpriteImage";
import { useDialog } from "@/components/ui/DialogProvider";
import { useTilt } from "@/components/ui/useTilt";
import styles from "./SoftwareSolutions.module.css";

export function SoftwareSolutions() {
  const { open } = useDialog();
  const tilt = useTilt();

  return (
    <section className="kx-section" id="solutions" aria-labelledby="solutions-title">
      <div className="kx-container">
        <Reveal className={styles.head}>
          <p className="kx-badge">Our software solutions</p>
          <h2 id="solutions-title" className={`kx-h2 ${styles.title}`}>
            One Business. One System.
            <br />
            <span className="kx-accent-violet">Complete Control.</span>
          </h2>
          <p className="kx-lead">
            Powerful software built to simplify operations, delight customers and accelerate growth.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {products.map((p, i) => (
            <Reveal
              as="article"
              key={p.id}
              id={p.id}
              className={`${styles.card} ${p.tone === "violet" ? styles.violet : styles.pink}`}
              delay={i * 110}
              {...tilt}
            >
              <div className={styles.copy}>
                <h3 className={styles.productTitle}>
                  {p.title[0]}
                  <br />
                  {p.title[1]}
                </h3>
                <p className={styles.body}>{p.body}</p>

                <ul className={styles.features}>
                  {p.features.map((f) => (
                    <li key={f}>
                      <span className={styles.check}>
                        <Check size={11} strokeWidth={3.5} aria-hidden="true" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Neither product has shipped, so this opens a coming-soon
                    dialog rather than linking to a page that does not exist. */}
                <button
                  type="button"
                  onClick={() => open(p.dialog)}
                  className={`kx-btn kx-btn--sm ${
                    p.tone === "violet" ? "kx-btn--violet" : "kx-btn--pink"
                  } ${styles.cta}`}
                >
                  {p.cta}
                  <ArrowRight size={16} className="kx-arrow" aria-hidden="true" />
                </button>
              </div>

              {/* Cropped straight out of the high-resolution product sheet, so
                  the dashboard stays sharp on retina displays. */}
              <div className={styles.shot}>
                <SpriteImage
                  {...productCrops[p.crop]}
                  sheet="product"
                  alt={p.imageAlt}
                  className={styles.shotImage}
                  sizes="(max-width: 760px) 170vw, 620px"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
