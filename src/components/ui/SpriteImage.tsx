import Image from "next/image";
import { PEOPLE_SHEET, PRODUCT_SHEET } from "@/content/site";

const SHEETS = {
  people: PEOPLE_SHEET,
  product: PRODUCT_SHEET,
} as const;

type SpriteImageProps = {
  /** Crop window in the natural pixel space of the source sheet. */
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  alt: string;
  /** Which source sheet the crop window refers to. */
  sheet?: keyof typeof SHEETS;
  className?: string;
  /** Rendered width of the *scaled sheet*, for srcset selection. */
  sizes?: string;
  priority?: boolean;
};

/**
 * Crops a window out of the supplied people sheet purely with CSS, so the
 * original transparent PNG stays the single source of truth and no derivative
 * asset is created. Renders a real <img> (via next/image, for AVIF/WebP and a
 * responsive srcset) rather than a background-image, so alt text survives.
 *
 * Maths: the box is given the crop's aspect ratio. The image is then blown up
 * to (sheetW / sw) of the box width; because both keep their aspect ratio, its
 * height lands on exactly (sheetH / sh) of the box height, which makes the
 * percentage offsets below resolve to the crop origin.
 */
export function SpriteImage({
  sx,
  sy,
  sw,
  sh,
  alt,
  sheet = "people",
  className,
  sizes = "(max-width: 900px) 90vw, 40vw",
  priority = false,
}: SpriteImageProps) {
  const source = SHEETS[sheet];

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        aspectRatio: `${sw} / ${sh}`,
      }}
    >
      <Image
        src={source.src}
        alt={alt}
        width={source.w}
        height={source.h}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        style={{
          position: "absolute",
          left: `${(-sx / sw) * 100}%`,
          top: `${(-sy / sh) * 100}%`,
          width: `${(source.w / sw) * 100}%`,
          height: "auto",
          maxWidth: "none",
        }}
      />
    </span>
  );
}
