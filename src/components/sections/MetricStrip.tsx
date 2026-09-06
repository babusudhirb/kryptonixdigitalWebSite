import { metrics } from "@/content/site";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./MetricStrip.module.css";

export function MetricStrip() {
  return (
    <div className={styles.wrap}>
      <div className="kx-container">
        <Reveal className={styles.strip}>
          <h2 className="kx-sr-only">Kryptonix by the numbers</h2>
          <ul className={styles.list}>
            {metrics.map((m) => (
              <li key={m.label} className={styles.item}>
                <Icon name={m.icon} size={38} strokeWidth={1.6} />
                <div>
                  <p className={styles.value}>{m.value}</p>
                  <p className={styles.label}>{m.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
