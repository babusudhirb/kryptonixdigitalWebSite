"use client";

import { Sparkles } from "lucide-react";
import { comingSoon, comingSoonShared } from "@/content/site";
import styles from "./ComingSoon.module.css";

/**
 * Salon / gym "coming soon" dialog. Neither product has shipped, so the copy
 * is exactly what the brief supplies — no feature list, no availability claim.
 */
export function ComingSoon({
  product,
  titleId,
  onTalk,
  onClose,
}: {
  product: "salon" | "gym";
  titleId: string;
  onTalk: () => void;
  onClose: () => void;
}) {
  const copy = comingSoon[product];

  return (
    <div className={styles.wrap}>
      <span className={styles.tile} aria-hidden="true">
        <Sparkles size={24} strokeWidth={1.9} />
      </span>

      <h2 id={titleId} className={styles.title}>
        {copy.title}
      </h2>
      <p className={styles.tagline}>{copy.tagline}</p>
      <p className={styles.body}>{copy.body}</p>

      <div className={styles.flagRow}>
        <span className={styles.flag}>{comingSoonShared.flag}</span>
      </div>

      <p className={styles.detail}>{comingSoonShared.detail(copy.title)}</p>

      <p className={styles.ask}>
        <strong>{comingSoonShared.ask}</strong> {comingSoonShared.askBody}
      </p>

      <div className={styles.actions}>
        <button type="button" className="kx-btn kx-btn--violet" onClick={onTalk}>
          {comingSoonShared.primary}
        </button>
        <button type="button" className="kx-btn kx-btn--ghost" onClick={onClose}>
          {comingSoonShared.secondary}
        </button>
      </div>
    </div>
  );
}
