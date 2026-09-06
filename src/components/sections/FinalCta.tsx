"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CTA_PERSON, finalCta, primaryCta } from "@/content/site";
import { CurlyArrow } from "@/components/graphics/CurlyArrow";
import { Reveal } from "@/components/ui/Reveal";
import { useDialog } from "@/components/ui/DialogProvider";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  const { open } = useDialog();

  return (
    <div className={styles.band}>
      <div className="kx-container">
        <Reveal as="section" className={styles.banner} aria-labelledby="final-cta-title">
          {/* The supplied cut-out — a real alpha channel, so it needs no
              clipping and stays sharp at every density. Breaks above the
              banner's top edge exactly as in the reference. */}
          <div className={styles.person}>
            <Image
              src={CTA_PERSON.src}
              width={CTA_PERSON.w}
              height={CTA_PERSON.h}
              alt={finalCta.imageAlt}
              sizes="(max-width: 860px) 62vw, 340px"
              className={styles.personImage}
            />
          </div>

          <div className={styles.copy}>
            <h2 id="final-cta-title" className={styles.title}>
              {finalCta.headline[0]}
              <br />
              {finalCta.headline[1]}
            </h2>
            <p className={styles.lead}>{finalCta.lead}</p>
          </div>

          <CurlyArrow className={styles.arrow} />

          <button
            type="button"
            onClick={() => open("lead")}
            className={`kx-btn kx-btn--white ${styles.cta}`}
          >
            {primaryCta.label}
            <ArrowRight size={18} className="kx-arrow" aria-hidden="true" />
          </button>
        </Reveal>
      </div>
    </div>
  );
}
