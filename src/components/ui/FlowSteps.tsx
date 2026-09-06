import { Icon, type IconKey } from "@/components/ui/Icons";
import styles from "./FlowSteps.module.css";

export type FlowStep = { label: string; icon: IconKey };

/**
 * Horizontal process flow — white tiles joined by thin arrows. Used for the
 * paid-ads conversion journey and the AI automation workflow.
 */
export function FlowSteps({
  steps,
  tone = "violet",
  label,
}: {
  steps: readonly FlowStep[];
  tone?: "violet" | "pink";
  label: string;
}) {
  return (
    <ol className={`${styles.flow} ${tone === "pink" ? styles.pink : styles.violet}`} aria-label={label}>
      {steps.map((s) => (
        <li key={s.label} className={styles.step}>
          <span className={styles.tile}>
            <Icon name={s.icon} size={20} strokeWidth={1.9} />
          </span>
          <span className={styles.label}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}
