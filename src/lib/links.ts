/**
 * The header and footer are shared by the one-page home route and the standalone
 * /privacy and /terms routes. A bare `#services` anchor only resolves on the
 * home page, so away from it the same link has to be rewritten as `/#services`
 * — otherwise every nav item is dead on the legal pages.
 *
 * Config keeps the bare `#id` form because the header's scroll-spy observes
 * elements by that id.
 */
export function sectionHref(href: string, pathname: string | null) {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}
