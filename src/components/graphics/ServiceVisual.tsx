/**
 * Currently unused: the salon & gym service cards follow the supplied
 * reference, which has no visual well. Kept — and self-contained, so it still
 * type-checks — in case the illustrated card treatment is wanted again.
 */
export type Kind = "code" | "rank" | "ads" | "flow" | "site" | "growth";

/**
 * Hand-authored vignette for each service card's visual well.
 *
 * The reference board fills that well with product photography and app
 * screenshots that were not supplied with it. Rather than invent stock imagery
 * or stretch an existing photo, each card gets an abstract vector sketch of
 * what the service produces — drawn in the brand palette, in the same inline
 * SVG idiom as RocketChart and CurlyArrow.
 *
 * All are 260 x 200 on a transparent ground and purely decorative; the card's
 * heading, body and checklist carry the meaning.
 */

const V = "#7c3aed";
const V_SOFT = "#b79bf0";
const P = "#f0197f";
const P_SOFT = "#f79cc4";
const PANEL = "#ffffff";
const LINE = "#e0d3f5";
/* Neutral bars sit on white, so they need real weight — anything paler reads
   as a loading skeleton rather than a drawn illustration. */
const GHOST = "#ddd0f4";

export function ServiceVisual({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Soft colour blobs behind the panel, so the vignette reads as a
          composed illustration rather than a floating white box. */}
      <circle cx="42" cy="42" r="40" fill={V} opacity="0.13" />
      <circle cx="222" cy="168" r="46" fill={P} opacity="0.11" />
      {VISUALS[kind]}
    </svg>
  );
}

/** Rounded panel used as the base of most vignettes. */
function Panel({ x = 26, y = 22, w = 208, h = 156, r = 14 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={PANEL} />
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={r} stroke={LINE} />
    </g>
  );
}

function Dots({ x = 40, y = 40 }) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.2" fill={P_SOFT} />
      <circle cx={x + 11} cy={y} r="3.2" fill={V_SOFT} />
      <circle cx={x + 22} cy={y} r="3.2" fill={GHOST} />
    </g>
  );
}

const VISUALS: Record<Kind, React.ReactNode> = {
  /* Software development — a code editor window. */
  code: (
    <>
      <Panel />
      <Dots />
      <rect x="26" y="54" width="208" height="1" fill={LINE} />
      <g fill={GHOST}>
        <rect x="42" y="70" width="46" height="7" rx="3.5" />
        <rect x="54" y="102" width="58" height="7" rx="3.5" />
        <rect x="42" y="150" width="40" height="7" rx="3.5" />
      </g>
      <rect x="94" y="70" width="62" height="7" rx="3.5" fill={V_SOFT} />
      <rect x="54" y="86" width="78" height="7" rx="3.5" fill={P} opacity="0.42" />
      <rect x="138" y="86" width="34" height="7" rx="3.5" fill={P_SOFT} />
      <rect x="54" y="118" width="88" height="7" rx="3.5" fill={V} opacity="0.62" />
      <rect x="54" y="134" width="52" height="7" rx="3.5" fill={V_SOFT} />
      {/* Cursor block, as in an editor's active line. */}
      <rect x="112" y="132" width="4" height="11" rx="2" fill={P} />
    </>
  ),

  /* SEO — a results list climbing to position one. */
  rank: (
    <>
      <Panel />
      <rect x="42" y="40" width="120" height="20" rx="10" fill={GHOST} />
      <circle cx="54" cy="50" r="5" stroke={V} strokeWidth="2.2" />
      <path d="m58 54 4 4" stroke={V} strokeWidth="2.2" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${i * 30})`}>
          <rect x="42" y="76" width="14" height="14" rx="4" fill={i === 0 ? V : V_SOFT} />
          <rect
            x="64"
            y="78"
            width={i === 0 ? 108 : 76 - i * 12}
            height="6"
            rx="3"
            fill={i === 0 ? V : GHOST}
            opacity={i === 0 ? 0.55 : 1}
          />
          <rect x="64" y="90" width={54 - i * 8} height="5" rx="2.5" fill={GHOST} opacity="0.75" />
        </g>
      ))}
      <path
        d="M192 148V96"
        stroke={P}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="m186 102 6-7 6 7" stroke={P} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="180" y="150" width="24" height="8" rx="4" fill={P_SOFT} />
    </>
  ),

  /* Google Ads — an ad slot with a click target. */
  ads: (
    <>
      <Panel />
      <rect x="42" y="38" width="30" height="12" rx="6" fill={P} />
      <rect x="42" y="60" width="118" height="8" rx="4" fill={V} opacity="0.5" />
      <rect x="42" y="76" width="88" height="8" rx="4" fill={GHOST} />
      <rect x="42" y="102" width="76" height="26" rx="8" fill={V} opacity="0.16" />
      <rect x="54" y="112" width="52" height="6" rx="3" fill={V} opacity="0.7" />
      <circle cx="182" cy="104" r="34" stroke={P_SOFT} strokeWidth="2.5" />
      <circle cx="182" cy="104" r="21" stroke={P} strokeWidth="2.5" />
      <circle cx="182" cy="104" r="7.5" fill={P} />
      <path
        d="M182 142v14"
        stroke={V}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
    </>
  ),

  /* AI & automation — a three-node flow that ends in a tick. */
  flow: (
    <>
      <Panel />
      <path
        d="M62 62h64c8 0 8 0 8 8v22c0 8 0 8 8 8h56"
        stroke={V_SOFT}
        strokeWidth="2.5"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <path
        d="M62 138h64c8 0 8 0 8-8v-22c0-8 0-8 8-8h56"
        stroke={P_SOFT}
        strokeWidth="2.5"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <g>
        <circle cx="54" cy="62" r="15" fill={V} opacity="0.12" />
        <circle cx="54" cy="62" r="5" fill={V} />
      </g>
      <g>
        <circle cx="54" cy="138" r="15" fill={P} opacity="0.12" />
        <circle cx="54" cy="138" r="5" fill={P} />
      </g>
      <rect x="116" y="86" width="36" height="28" rx="9" fill={V} />
      <circle cx="127" cy="100" r="3" fill="#fff" />
      <circle cx="141" cy="100" r="3" fill="#fff" />
      <g>
        <circle cx="200" cy="100" r="19" fill={P} />
        <path
          d="m192 100 6 6 11-12"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </>
  ),

  /* Web development — a browser frame with a phone beside it. */
  site: (
    <>
      <rect x="20" y="26" width="176" height="130" rx="12" fill={PANEL} />
      <rect x="20.5" y="26.5" width="175" height="129" rx="12" stroke={LINE} />
      <path d="M20 50h176" stroke={LINE} />
      <Dots x={34} y={38} />
      <rect x="34" y="64" width="86" height="9" rx="4.5" fill={V} opacity="0.68" />
      <rect x="34" y="82" width="106" height="6" rx="3" fill={GHOST} />
      <rect x="34" y="95" width="84" height="6" rx="3" fill={GHOST} />
      <rect x="34" y="116" width="58" height="20" rx="10" fill={P} />
      <rect x="148" y="64" width="34" height="72" rx="8" fill={V} opacity="0.2" />
      <g>
        <rect x="176" y="70" width="64" height="112" rx="13" fill={PANEL} />
        <rect x="176.5" y="70.5" width="63" height="111" rx="13" stroke={LINE} />
        <rect x="194" y="76" width="28" height="4" rx="2" fill={GHOST} />
        <rect x="186" y="92" width="44" height="26" rx="7" fill={V} opacity="0.28" />
        <rect x="186" y="126" width="44" height="5" rx="2.5" fill={GHOST} />
        <rect x="186" y="137" width="30" height="5" rx="2.5" fill={GHOST} />
        <rect x="186" y="155" width="44" height="14" rx="7" fill={P} opacity="0.75" />
      </g>
    </>
  ),

  /* Business growth — a rising bar chart under a trend line. */
  growth: (
    <>
      <Panel />
      <rect x="42" y="40" width="62" height="7" rx="3.5" fill={GHOST} />
      <rect x="42" y="54" width="38" height="12" rx="6" fill={V} opacity="0.24" />
      {[
        { x: 46, h: 30 },
        { x: 78, h: 46 },
        { x: 110, h: 38 },
        { x: 142, h: 62 },
        { x: 174, h: 84 },
      ].map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={156 - b.h}
          width="22"
          height={b.h}
          rx="6"
          fill={i === 4 ? P : V}
          opacity={i === 4 ? 1 : 0.18 + i * 0.1}
        />
      ))}
      <path
        d="M57 116 89 98l32 8 32-26 32-18"
        stroke={P}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 5"
        opacity="0.8"
      />
      <circle cx="185" cy="62" r="5" fill={P} />
      <path d="M26 156h208" stroke={LINE} />
    </>
  ),
};
