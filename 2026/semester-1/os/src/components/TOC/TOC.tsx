import { useEffect, useState } from 'react';
import * as s from './TOC.css';

type Heading = { id: string; text: string; level: 2 | 3 };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export function TOC({ rootRef }: { rootRef: React.RefObject<HTMLElement | null> }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll('h2, h3');
    const result: Heading[] = [];
    nodes.forEach((node) => {
      const el = node as HTMLElement;
      const text = el.textContent ?? '';
      if (!text.trim()) return;
      if (!el.id) el.id = slugify(text);
      result.push({ id: el.id, text, level: el.tagName === 'H2' ? 2 : 3 });
    });
    setHeadings(result);
  }, [rootRef]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className={s.toc}>
      <div className={s.title}>이 페이지에서</div>
      <ul className={s.list}>
        {headings.map((h) => (
          <li key={h.id} className={s.item}>
            <a
              href={`#${h.id}`}
              className={`${s.link} ${h.level === 3 ? s.h3 : ''} ${
                activeId === h.id ? s.linkActive : ''
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
