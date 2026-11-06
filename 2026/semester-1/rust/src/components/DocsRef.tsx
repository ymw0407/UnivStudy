import * as s from "./DocsRef.css";

export interface DocLink {
  href: string;
  text: string;
}

interface DocsRefProps {
  links: DocLink[];
}

export function DocsRef({ links }: DocsRefProps) {
  return (
    <div className={s.container}>
      <strong className={s.title}>📚 공식 문서</strong>
      <ul className={s.list}>
        {links.map((l) => (
          <li key={l.href}>
            <a className={s.link} href={l.href} target="_blank" rel="noreferrer">
              {l.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
