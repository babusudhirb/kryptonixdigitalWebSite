import { Mail, MapPin, Phone } from "lucide-react";
import { brand, footerColumns } from "@/content/site";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

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
                    <a href={l.href} className={styles.colLink}>
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
          <a href="#top">Privacy Policy</a>
          <a href="#top">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
