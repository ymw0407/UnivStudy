import { Link } from 'react-router-dom';
import { parts, chaptersByPart, chapters } from '../content/manifest';
import * as s from './Home.css';

export function Home() {
  const first = chapters[0];

  return (
    <div className={s.root}>
      <section className={s.hero}>
        <div className={s.heroEyebrow}>Quantum Computing · 입문 학습 노트</div>
        <h1 className={s.heroTitle}>벡터로 이해하는 양자컴퓨팅</h1>
        <p className={s.heroDesc}>
          양자컴퓨팅도 물리도 처음인 사람을 위한 노트입니다. 먼저 디지털 회로의 덧셈기를 양자
          회로로 다시 만들어 보며 큐비트·게이트·측정을 손으로 익히고, 그다음 &ldquo;양자 상태는
          벡터, 양자 연산은 행렬&rdquo; 이라는 한 문장을 복소수부터 차근차근 풀어 갑니다.
        </p>
        <div className={s.heroActions}>
          <Link to={`/ch/${first.slug}`} className={s.primaryBtn}>
            1장부터 시작하기 →
          </Link>
          <Link to="/quiz" className={s.secondaryBtn}>
            ✎ 시험 대비 문제 풀기
          </Link>
          <span className={s.heroMeta}>
            「프로그래밍으로 배우는 양자컴퓨팅」 강의자료(임은진·권용경) 기반 · 전 {chapters.length}장
          </span>
        </div>
      </section>

      {parts.map((part, i) => (
        <section key={part.id} className={s.partSection}>
          <header className={s.partHeader}>
            <div className={s.partLabel}>Part {i + 1}</div>
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
