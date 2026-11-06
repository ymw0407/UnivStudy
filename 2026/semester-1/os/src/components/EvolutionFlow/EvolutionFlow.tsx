import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { EvolutionNode } from '../../pages/evolution-data';
import * as s from './EvolutionFlow.css';

// 이미지 로드 실패 시 플레이스홀더로 대체. public/figures/ 에 아직 파일이
// 없을 때 브라우저의 깨진 이미지 아이콘이 뜨는 대신 친절한 문구를 보여 준다.
function ResilientFigure({ src, alt }: { src: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveFigure(src);
  return (
    <figure className={s.figure}>
      {failed ? (
        <div className={s.figurePlaceholder}>
          {alt ?? '이미지 준비 중'} (public/figures/ 에 파일이 없습니다)
        </div>
      ) : (
        <img
          className={s.figureImg}
          src={resolved}
          alt={alt ?? ''}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      {alt && <figcaption className={s.figureCaption}>{alt}</figcaption>}
    </figure>
  );
}

function readInitialNode(search: string, fallback: string): string {
  try {
    return new URLSearchParams(search).get('node') ?? fallback;
  } catch {
    return fallback;
  }
}

export function EvolutionFlow({
  eyebrow,
  title,
  description,
  nodes,
}: {
  eyebrow: string;
  title: string;
  description: string;
  nodes: EvolutionNode[];
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // 로컬 state + URL 1회 초기화. (HashRouter + useSearchParams 조합의 re-render 이슈를 피함)
  const [activeId, setActiveId] = useState(() =>
    readInitialNode(location.search, nodes[0].id),
  );

  // 외부에서 URL 의 `?node=` 가 바뀐 경우(예: 홈에서 딥링크로 진입) state 동기화
  useEffect(() => {
    const fromUrl = readInitialNode(location.search, nodes[0].id);
    setActiveId((curr) => (curr === fromUrl ? curr : fromUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const activeIndex = Math.max(0, nodes.findIndex((n) => n.id === activeId));
  const active = nodes[activeIndex];

  const flowRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);

  const selectNode = useCallback(
    (id: string) => {
      setActiveId(id);
      // URL 에도 반영 — 공유·새로고침 대응. replace 로 histoy 오염 방지.
      const sp = new URLSearchParams(location.search);
      sp.set('node', id);
      navigate({ pathname: location.pathname, search: `?${sp.toString()}` }, { replace: true });
    },
    [location.pathname, location.search, navigate],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (activeIndex < nodes.length - 1) {
          e.preventDefault();
          selectNode(nodes[activeIndex + 1].id);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (activeIndex > 0) {
          e.preventDefault();
          selectNode(nodes[activeIndex - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, nodes, selectNode]);

  // 활성 노드가 flow col 밖에 있으면 부드럽게 스크롤
  useEffect(() => {
    const el = activeRef.current;
    const container = flowRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    if (elRect.top < cRect.top || elRect.bottom > cRect.bottom) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeId]);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.eyebrow}>{eyebrow}</div>
        <h1 className={s.title}>{title}</h1>
        <p className={s.desc}>{description}</p>
      </header>

      <div className={s.layout}>
        <div className={s.flowCol} ref={flowRef}>
          <div className={s.flowList}>
            {nodes.map((node, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              const isFuture = i > activeIndex;
              return (
                <div key={node.id} ref={isActive ? activeRef : undefined}>
                  {node.phase && <div className={s.phaseHeader}>{node.phase}</div>}
                  <button
                    type="button"
                    onClick={() => selectNode(node.id)}
                    className={`${s.node} ${isActive ? s.nodeActive : ''} ${
                      isPast ? s.nodePast : ''
                    } ${isFuture ? s.nodeFuture : ''}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <div className={s.nodeIndex}>#{String(i + 1).padStart(2, '0')}</div>
                    <div className={s.nodeTitle}>{node.title}</div>
                    <div className={s.nodeTagline}>{node.tagline}</div>
                  </button>
                  {i < nodes.length - 1 && node.problem && (
                    <div className={s.connector}>
                      <div className={s.connectorLine} />
                      <div className={s.connectorLabel}>
                        다음 문제 → {truncate(node.problem, 60)}
                      </div>
                      <div className={s.connectorLine} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={s.detailCol}>
          <article className={s.detailCard}>
            <div className={s.detailEyebrowRow}>
              <span className={s.detailEyebrow}>
                {activeIndex + 1} / {nodes.length}
              </span>
              {active.phase && <span className={s.detailPhaseBadge}>{active.phase}</span>}
            </div>
            <h2 className={s.detailTitle}>{active.title}</h2>
            <p className={s.detailTagline}>{active.tagline}</p>

            {active.image && (
              <ResilientFigure src={active.image.src} alt={active.image.alt} />
            )}
            {active.extraImages?.map((img, i) => (
              <ResilientFigure key={i} src={img.src} alt={img.alt} />
            ))}

            <section className={s.section}>
              <div className={`${s.sectionLabel} ${s.sectionIdea}`}>핵심 아이디어</div>
              <div className={s.sectionBody}>{active.keyIdea}</div>
              {active.subIdeas && active.subIdeas.length > 0 && (
                <ul className={s.subIdeaList}>
                  {active.subIdeas.map((idea, i) => (
                    <li key={i} className={s.subIdeaItem}>
                      {idea}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {active.advantage && (
              <section className={s.section}>
                <div className={`${s.sectionLabel} ${s.sectionAdvantage}`}>이전과 비교해 나아진 점</div>
                <div className={s.sectionBody}>{active.advantage}</div>
              </section>
            )}

            {active.problem && (
              <section className={s.section}>
                <div className={`${s.sectionLabel} ${s.sectionProblem}`}>다음 단계로 이어지는 이유</div>
                <div className={s.sectionBody}>{active.problem}</div>
              </section>
            )}

            <Link
              to={`/ch/${active.to.chapter}${active.to.anchor ? `#${active.to.anchor}` : ''}`}
              className={s.readMore}
            >
              본문에서 자세히 보기
              <span className={s.readMoreArrow} aria-hidden>
                →
              </span>
            </Link>

            <div className={s.meta}>
              ↑ / ↓ 키 또는 좌측 카드 클릭으로 이동 · {activeIndex + 1} / {nodes.length}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function resolveFigure(src: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  const base = import.meta.env.BASE_URL || '/';
  const trimmed = src.replace(/^\//, '');
  return base.endsWith('/') ? base + trimmed : base + '/' + trimmed;
}
