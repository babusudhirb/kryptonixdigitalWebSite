import { Check } from "lucide-react";
import { peopleCrops, process, results } from "@/content/site";
import { SpriteImage } from "@/components/ui/SpriteImage";
import { RocketChart } from "@/components/graphics/RocketChart";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./ProcessResults.module.css";

export function ProcessResults() {
  return (
    <div className={`kx-section ${styles.band}`}>
      <div className={`kx-container ${styles.grid}`}>
        {/* ---------------- Process ---------------- */}
        <Reveal
          as="section"
          id="process"
          className={`${styles.card} ${styles.process}`}
          aria-labelledby="process-title"
        >
          <div className={styles.processCopy}>
            <p className="kx-badge">{process.badge}</p>
            <h2 id="process-title" className={`kx-h2 ${styles.title}`}>
              {process.headline}
            </h2>
            <p className={styles.lead}>{process.lead}</p>

            {/* On phones this is a horizontal snap rail, so it is focusable and
                labelled — the four-step count has to survive the scroll. */}
            <ol
              className={styles.steps}
              tabIndex={0}
              role="group"
              aria-label={`${process.headline}, ${process.steps.length} steps`}
            >
              {process.steps.map((s) => (
                <li key={s.num} className={styles.step}>
                  <span className={styles.disc}>{s.num}</span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepBody}>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Team crop out of the supplied people sheet, ringed as in the reference. */}
          <div className={styles.ring}>
            <SpriteImage
              {...peopleCrops.team}
              alt={process.imageAlt}
              className={styles.ringImage}
              sizes="(max-width: 1100px) 60vw, 700px"
            />
          </div>
        </Reveal>

        {/* ---------------- Results ---------------- */}
        <Reveal
          as="section"
          id="results"
          className={`${styles.card} ${styles.results}`}
          aria-labelledby="results-title"
          delay={110}
        >
          <p className="kx-badge">{results.badge}</p>
          <h2 id="results-title" className={`kx-h2 ${styles.title}`}>
            {results.headline[0]}
            <br />
            {results.headline[1]}
          </h2>

          {/* Heading runs full width so it keeps to two lines; the wins list
              and the growth chart then sit side by side beneath it. */}
          <div className={styles.resultsBody}>
            <ul className={styles.wins}>
              {results.items.map((item) => (
                <li key={item}>
                  <span className={styles.check}>
                    <Check size={11} strokeWidth={3.5} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <RocketChart className={styles.chart} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
