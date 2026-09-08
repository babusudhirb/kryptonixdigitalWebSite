import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DialogProvider } from "@/components/ui/DialogProvider";
import styles from "./LegalPage.module.css";

/**
 * Shell shared by /privacy and /terms. Wraps in DialogProvider because the
 * header and footer CTAs open the strategy form from these pages too.
 *
 * The copy on both pages is a placeholder pending legal review — the `updated`
 * line says so on the page itself rather than implying a reviewed document.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <DialogProvider>
      <Header />
      <main id="main" className={styles.main}>
        <div className={`kx-container ${styles.inner}`}>
          <Link href="/" className={styles.back}>
            <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
            Back to home
          </Link>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>{updated}</p>
          <p className={styles.intro}>{intro}</p>

          {sections.map((s) => (
            <section key={s.heading} className={styles.section}>
              <h2 className={styles.heading}>{s.heading}</h2>
              <p className={styles.body}>{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer onLegal />
    </DialogProvider>
  );
}
