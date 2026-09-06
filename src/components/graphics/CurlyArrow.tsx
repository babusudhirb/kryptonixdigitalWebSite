/**
 * Loose hand-drawn arrow used in the final CTA banner to lead the eye from the
 * headline across to the booking button.
 */
export function CurlyArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 116 62"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      >
        <path d="M4 54C6 34 26 22 46 32C55 37 53 48 45 45C37 42 40 29 56 22C72 15 90 16 103 22" />
        <path d="M95 13L106 22L95 32" />
      </g>
    </svg>
  );
}
