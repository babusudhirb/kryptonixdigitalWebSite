"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { nav, primaryCta } from "@/content/site";
import { useDialog } from "@/components/ui/DialogProvider";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

export function Header() {
  const { open: openDialog } = useDialog();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#top");

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Solidify the bar once the hero starts scrolling away. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the section currently in view. */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = nav.map((n) => n.href.slice(1));
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6] },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  /* Drawer: scroll lock, Escape to dismiss and a simple focus trap. */
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
        'a[href], button:not([disabled])',
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
    // Move focus into the drawer so keyboard users land inside it.
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.solid : ""}`}>
      <div className={`kx-container ${styles.bar}`}>
        <a href="#top" className={styles.brand} aria-label="Kryptonix — home">
          <Logo decorative priority />
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`${styles.navLink} ${active === item.href ? styles.navActive : ""}`}
                  aria-current={active === item.href ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => openDialog("lead")}
            className={`kx-btn kx-btn--pink kx-btn--sm ${styles.cta}`}
          >
            {primaryCta.label}
            <ArrowRight size={17} className="kx-arrow" aria-hidden="true" />
          </button>

          <button
            ref={toggleRef}
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="kx-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`${styles.scrim} ${open ? styles.scrimOpen : ""}`}
        onClick={close}
        aria-hidden="true"
      />
      {/* Fixed, viewport-sized clip frame. Without it the off-canvas panel
          still counts toward the document's scroll width even while hidden. */}
      <div className={styles.panelClip} aria-hidden={!open || undefined}>
      <div
        id="kx-mobile-nav"
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-modal={open || undefined}
        aria-label="Site menu"
        // Keeps the closed drawer out of the tab order and off the a11y tree.
        inert={!open}
      >
        <nav aria-label="Mobile">
          <ul className={styles.panelList}>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.panelLink} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className={`kx-btn kx-btn--pink ${styles.panelCta}`}
          onClick={() => {
            // Close the drawer first so the dialog is not layered over it and
            // the body scroll lock is owned by one component at a time.
            setOpen(false);
            openDialog("lead");
          }}
        >
          {primaryCta.label}
          <ArrowRight size={18} className="kx-arrow" aria-hidden="true" />
        </button>
      </div>
      </div>
    </header>
  );
}
