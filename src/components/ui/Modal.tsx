"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

/**
 * Accessible dialog shell shared by the coming-soon modals and the strategy
 * form. Behaviour mirrors the mobile drawer in Header.tsx — scroll lock,
 * Escape, and a Tab focus trap — with focus restored to whatever opened it.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  size = "sm",
}: {
  open: boolean;
  onClose: () => void;
  /** id of the heading inside `children` that names the dialog. */
  labelledBy: string;
  children: React.ReactNode;
  size?: "sm" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  /* Remember the trigger the moment the dialog opens. */
  useEffect(() => {
    if (open) restoreRef.current = document.activeElement as HTMLElement | null;
  }, [open]);

  const close = useCallback(() => {
    onClose();
    // Hand focus back to the button that opened this, so keyboard users do not
    // get dropped at the top of the document.
    restoreRef.current?.focus?.();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    // Land on the panel itself rather than the first control, so a screen
    // reader announces the dialog's name before its fields.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className={styles.root} role="presentation">
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`${styles.panel} ${size === "lg" ? styles.lg : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy || titleId}
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={close} aria-label="Close dialog">
          <X size={19} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
