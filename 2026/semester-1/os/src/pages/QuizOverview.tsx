import { Link } from 'react-router-dom';
import { quizIndex } from '../content/quizzes';
import * as s from '../components/Quiz/Quiz.css';

export function QuizOverview() {
  const cpuQuizzes = quizIndex.filter((q) => q.partId === 'cpu');
  const memQuizzes = quizIndex.filter((q) => q.partId === 'memory');
  const concurrencyQuizzes = quizIndex.filter((q) => q.partId === 'concurrency');
  const persistenceQuizzes = quizIndex.filter((q) => q.partId === 'persistence');

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.eyebrow}>Practice</div>
        <h1 className={s.title}>문제 풀어보기</h1>
        <p className={s.desc}>
          각 챕터 별로 객관식 · O/X · 코드 빈칸 · 단답 · 서술형 문제를 준비했습니다. 풀고 바로
          채점되며 (서술형은 모범답안을 확인), 같은 문제는 언제든 다시 풀 수 있습니다.
        </p>
      </header>

      <section className={s.partSection}>
        <h2 className={s.partTitle}>Part 1. CPU 가상화</h2>
        <p className={s.partDesc}>프로세스, 시스템콜, 스케줄링.</p>
        <div className={s.quizGrid}>
          {cpuQuizzes.map((q) => (
            <Link key={q.slug} to={`/quiz/${q.slug}`} className={s.quizCard}>
              <span className={s.quizCardNumber}>Ch. {String(q.chapterNumber).padStart(2, '0')}</span>
              <span className={s.quizCardTitle}>{q.title}</span>
              {q.subtitle && <span className={s.quizCardMeta}>{q.subtitle}</span>}
            </Link>
          ))}
        </div>
      </section>

      <section className={s.partSection}>
        <h2 className={s.partTitle}>Part 2. 메모리 가상화</h2>
        <p className={s.partDesc}>주소 공간, 페이징, TLB, 다단계 페이지 테이블.</p>
        <div className={s.quizGrid}>
          {memQuizzes.map((q) => (
            <Link key={q.slug} to={`/quiz/${q.slug}`} className={s.quizCard}>
              <span className={s.quizCardNumber}>Ch. {String(q.chapterNumber).padStart(2, '0')}</span>
              <span className={s.quizCardTitle}>{q.title}</span>
              {q.subtitle && <span className={s.quizCardMeta}>{q.subtitle}</span>}
            </Link>
          ))}
        </div>
      </section>

      {concurrencyQuizzes.length > 0 && (
        <section className={s.partSection}>
          <h2 className={s.partTitle}>Part 3. 동시성 (Concurrency)</h2>
          <p className={s.partDesc}>Thread, lock, condition variable, semaphore.</p>
          <div className={s.quizGrid}>
            {concurrencyQuizzes.map((q) => (
              <Link key={q.slug} to={`/quiz/${q.slug}`} className={s.quizCard}>
                <span className={s.quizCardNumber}>Ch. {String(q.chapterNumber).padStart(2, '0')}</span>
                <span className={s.quizCardTitle}>{q.title}</span>
                {q.subtitle && <span className={s.quizCardMeta}>{q.subtitle}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {persistenceQuizzes.length > 0 && (
        <section className={s.partSection}>
          <h2 className={s.partTitle}>Part 4. 영속성 (Persistence)</h2>
          <p className={s.partDesc}>File, directory, inode, fd.</p>
          <div className={s.quizGrid}>
            {persistenceQuizzes.map((q) => (
              <Link key={q.slug} to={`/quiz/${q.slug}`} className={s.quizCard}>
                <span className={s.quizCardNumber}>Ch. {String(q.chapterNumber).padStart(2, '0')}</span>
                <span className={s.quizCardTitle}>{q.title}</span>
                {q.subtitle && <span className={s.quizCardMeta}>{q.subtitle}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
