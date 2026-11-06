import { Link } from 'react-router-dom';
import { parts, chaptersByPart } from '../content/manifest';
import * as s from './Home.css';

export function Home() {
  return (
    <div className={s.root}>
      <section className={s.hero}>
        <div className={s.heroEyebrow}>Operating Systems · Study Notes</div>
        <h1 className={s.heroTitle}>운영체제 정리</h1>
        <p className={s.heroDesc}>
          OSTEP 을 따라가며 정리한 운영체제 학습 노트입니다. CPU 가상화와 메모리 가상화 두 축을
          중심으로, 각 개념이 어떤 문제를 풀기 위해 등장했고 다음 단계에서 어떤 새로운 문제를 만드는지
          &ldquo;문제 → 해결 → 한계&rdquo; 흐름으로 이어 읽을 수 있습니다.
        </p>
      </section>

      <section className={s.evoStrip}>
        <Link to="/evolution/scheduler" className={s.evoCard}>
          <span className={s.evoLabel}>Interactive Overview</span>
          <span className={s.evoTitle}>Scheduler 변천사</span>
          <span className={s.evoDesc}>
            FIFO → SJF → STCF → RR → MLFQ → Lottery → Stride → CFS 흐름을 한눈에. 각 노드를 눌러
            본문으로 이동.
          </span>
          <span className={s.evoArrow}>살펴보기 →</span>
        </Link>
        <Link to="/evolution/memory" className={s.evoCard}>
          <span className={s.evoLabel}>Interactive Overview</span>
          <span className={s.evoTitle}>Memory Virtualization 변천사</span>
          <span className={s.evoDesc}>
            Address Space → Base/Bound → Segmentation → Free-Space → Paging → TLB → Multi-Level 까지
            9단계 흐름.
          </span>
          <span className={s.evoArrow}>살펴보기 →</span>
        </Link>
      </section>

      {parts.map((part) => (
        <section key={part.id} className={s.partSection}>
          <header className={s.partHeader}>
            <div className={s.partLabel}>
              {part.id === 'cpu' ? 'Part 1' : part.id === 'memory' ? 'Part 2' : 'Part 3'}
            </div>
            <h2 className={s.partTitle}>{part.title}</h2>
            <p className={s.partDesc}>{part.description}</p>
          </header>
          <div className={s.chapterGrid}>
            {chaptersByPart(part.id).map((ch) => (
              <Link key={ch.slug} to={`/ch/${ch.slug}`} className={s.chapterCard}>
                <span className={s.chapterNumber}>Ch. {String(ch.number).padStart(2, '0')}</span>
                <span className={s.chapterTitle}>{ch.title}</span>
                {ch.subtitle && <span className={s.chapterSubtitle}>{ch.subtitle}</span>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
