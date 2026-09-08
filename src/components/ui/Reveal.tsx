"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

type RevealTag = "div" | "article" | "section" | "li" | "header" | "figure";

/** Anything else valid on the rendered element — ids, aria-*, and the pointer
 *  handlers from `useTilt`, which spread straight onto the card. */
type RevealProps = {
  children: ReactNode;
  /** Rendered element — Reveal replaces the wrapper rather than adding one, so
   *  it can sit directly in a grid without breaking the layout. */
  as?: RevealTag;
  className?: string;
  /** Stagger, in milliseconds. */
  delay?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "style" | "children">;

/**
 * One-shot fade + rise on scroll. Fully bypassed under
 * `prefers-reduced-motion: reduce` (content renders immediately, no transition).
 */
export function Reveal({ children, as = "div", className, delay = 0, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: ["kx-reveal", shown ? "is-in" : "", className].filter(Boolean).join(" "),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
      ...rest,
    },
    children,
  );
}
