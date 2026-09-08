"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cursor-tracked 3D tilt for cards.
 *
 * Deliberately not a dependency: vanilla-tilt is imperative and would need a
 * React wrapper anyway, and this is the exact motion the site needs.
 *
 * Ref-free by design — it works off `event.currentTarget`, so the returned
 * props can be spread onto any element (including one rendered by `Reveal`)
 * without having to merge refs.
 *
 * - Fine pointer: rotates toward the cursor, capped at MAX_DEG.
 * - Coarse pointer (touch): no rotation — the card dips slightly on press
 *   instead, because tilt is meaningless without a hovering cursor.
 * - `prefers-reduced-motion: reduce`: returns no handlers, so nothing moves.
 */

const MAX_DEG = 6;
const LIFT_PX = 6;

type TiltHandlers = {
  onPointerMove?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel?: (e: React.PointerEvent<HTMLElement>) => void;
};

export function useTilt(): TiltHandlers {
  const frame = useRef(0);
  const [mode, setMode] = useState<"off" | "tilt" | "press">("off");

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    const resolve = () => setMode(reduced.matches ? "off" : coarse.matches ? "press" : "tilt");
    resolve();

    reduced.addEventListener("change", resolve);
    coarse.addEventListener("change", resolve);
    return () => {
      reduced.removeEventListener("change", resolve);
      coarse.removeEventListener("change", resolve);
    };
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const reset = useCallback((e: React.PointerEvent<HTMLElement>) => {
    cancelAnimationFrame(frame.current);
    e.currentTarget.style.transform = "";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const { clientX, clientY } = e;

    // One write per frame — pointermove fires far faster than the compositor.
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      // -0.5 .. 0.5 from the card's centre.
      const px = (clientX - r.left) / r.width - 0.5;
      const py = (clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateX(${(-py * MAX_DEG * 2).toFixed(2)}deg) ` +
        `rotateY(${(px * MAX_DEG * 2).toFixed(2)}deg) translateY(-${LIFT_PX}px)`;
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "scale(0.985)";
  }, []);

  if (mode === "off") return {};

  if (mode === "press") {
    return { onPointerDown, onPointerUp: reset, onPointerLeave: reset, onPointerCancel: reset };
  }

  return {
    onPointerMove,
    onPointerLeave: reset,
    onPointerUp: reset,
    onPointerCancel: reset,
  };
}
