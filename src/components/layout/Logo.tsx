import Image from "next/image";
import { LOGO } from "@/content/site";
import styles from "./Logo.module.css";

/**
 * The supplied Kryptonix logo. The asset already carries the mark, the
 * KRYPTONIX wordmark and the "DIGITAL & AI SOLUTIONS" strapline, so nothing
 * here sets them in type — doing so would render the brand name twice.
 *
 * Sized by height with `width: auto` off the image's intrinsic 1950 x 631, so
 * the aspect ratio can never be squashed and nothing is ever cropped.
 */
export function Logo({
  /** `true` when an ancestor link already carries the accessible name. */
  decorative = false,
  priority = false,
  className,
}: {
  decorative?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={LOGO.src}
      width={LOGO.w}
      height={LOGO.h}
      alt={decorative ? "" : "Kryptonix — Digital & AI Solutions"}
      priority={priority}
      sizes="240px"
      className={`${styles.image} ${className ?? ""}`}
    />
  );
}
