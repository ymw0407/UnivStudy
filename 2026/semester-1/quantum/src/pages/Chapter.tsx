import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { chapterBySlug, parts, type ChapterMeta } from '../content/manifest';
import { PageNav } from '../components/PageNav/PageNav';
import { TOC } from '../components/TOC/TOC';
import { mdxComponents } from '../mdxComponents';
import * as s from './Chapter.css';

function ChapterBody({ meta }: { meta: ChapterMeta }) {
  const MdxComponent = useMemo(() => lazy(meta.loader), [meta.slug]);
  return (
    <Suspense fallback={<p>로딩 중…</p>}>
      <MdxComponent
        components={mdxComponents as Record<string, React.ComponentType<unknown>>}
      />
    </Suspense>
  );
}

export function Chapter() {
  const { slug } = useParams<{ slug: string }>();
  const meta = chapterBySlug(slug);
  const articleRef = useRef<HTMLElement | null>(null);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug, hash]);

  if (!meta) {
    return (
      <div className={s.notFound}>
        <p>존재하지 않는 챕터입니다.</p>
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    );
  }

  const part = parts.find((p) => p.id === meta.partId);

  return (
    <div className={s.layout}>
      <article className={s.article} ref={articleRef}>
        <div className={s.breadcrumb}>
          {part?.title} · Chapter {String(meta.number).padStart(2, '0')}
        </div>
        <h1 className={s.title}>{meta.title}</h1>
        {meta.subtitle && <div className={s.subtitle}>{meta.subtitle}</div>}
        <div className={s.divider} />
        <div className={s.body}>
          <ChapterBody key={meta.slug} meta={meta} />
        </div>
        <PageNav slug={meta.slug} />
      </article>
      <div className={s.tocCol}>
        <TOC rootRef={articleRef} />
      </div>
    </div>
  );
}
