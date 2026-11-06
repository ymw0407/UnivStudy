import { Link } from "react-router-dom";
import type { StepMeta } from "../data/steps";
import { useLocale } from "../i18n";
import * as s from "./StepCard.css";

export function StepCardList({ steps }: { steps: StepMeta[] }) {
  const { locale } = useLocale();
  return (
    <ol className={s.list}>
      {steps.map((step) => (
        <li key={step.step} className={s.card}>
          <Link className={s.cardLink} to={`/step/${step.step}`}>
            {step.title[locale]}
          </Link>
          <span className={s.desc}>{step.desc[locale]}</span>
          <div className={s.tags}>
            {[...step.tags[locale], step.date[locale]].map((t) => (
              <span key={t} className={s.tag}>
                {t}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
