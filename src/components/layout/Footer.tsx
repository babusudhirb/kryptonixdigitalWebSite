import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand, footerColumns } from "@/content/site";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

/**
 * `onLegal` rewrites the section anchors to `/#id`, because the footer is also
 * rendered on /privacy and /terms where a bare `#id` would point at nothing.
 */
export function Footer({ onLegal = false }: { onLegal?: boolean }) {
  const year = new Date().getFullYear();
  const to = (href: string) =>
    href.startsWith("#") && onLegal ? `/${href}` : href;

  return (
    <footer className={styles.footer} id="contact">
      <div className={`kx-container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.blurb}>{brand.positioning}</p>
        </div>

        <nav className={styles.columns} aria-label="Footer">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className={styles.colTitle}>{col.title}</h2>
              <ul className={styles.colList}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={to(l.href)} className={styles.colLink}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className={styles.colTitle}>Contact</h2>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactIcon}>
                  <Phone size={15} strokeWidth={2} aria-hidden="true" />
                </span>
                <a href={brand.phoneHref} className={styles.colLink}>
                  {brand.phone}
                </a>
              </li>
              <li>
                <span className={styles.contactIcon}>
                  <Mail size={15} strokeWidth={2} aria-hidden="true" />
                </span>
                <a href={brand.emailHref} className={styles.colLink}>
                  {brand.email}
                </a>
              </li>
              <li>
                <span className={styles.contactIcon}>
                  <MapPin size={15} strokeWidth={2} aria-hidden="true" />
                </span>
                <address className={styles.address}>
                  {brand.address.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < brand.address.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={`kx-container ${styles.legal}`}>
        <p>
          © {year} {brand.name} {brand.tagline}. All rights reserved.
        </p>
        <p className={styles.legalLinks}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}
