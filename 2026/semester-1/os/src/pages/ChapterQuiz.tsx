import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quizEntryBySlug } from '../content/quizzes';
import type { QuizSet } from '../content/quizzes/types';
import {
  QuestionCard,
  type QuestionState,
} from '../components/Quiz/QuestionCard';
import * as s from '../components/Quiz/Quiz.css';

const INITIAL_STATE: QuestionState = { submitted: false, correct: null, revealed: false };

export function ChapterQuiz() {
  const { slug } = useParams<{ slug: string }>();
  const entry = quizEntryBySlug(slug);

  const [quiz, setQuiz] = useState<QuizSet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry) return;
    let cancelled = false;
    entry
      .loader()
      .then((m) => {
        if (!cancelled) setQuiz(m.default);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [entry?.slug]);

  // 문항별 제출 상태 — 퀴즈가 바뀌면 리셋
  const [states, setStates] = useState<Record<string, QuestionState>>({});
  useEffect(() => {
    if (quiz) setStates(Object.fromEntries(quiz.questions.map((q) => [q.id, INITIAL_STATE])));
  }, [quiz?.slug]);

  const { gradable, submitted, correct } = useMemo(() => {
    if (!quiz) return { gradable: 0, submitted: 0, correct: 0 };
    let g = 0;
    let s = 0;
    let c = 0;
    for (const q of quiz.questions) {
      const st = states[q.id];
      if (q.type === 'essay') continue;
      g += 1;
      if (st?.submitted) {
        s += 1;
        if (st.correct) c += 1;
      }
    }
    return { gradable: g, submitted: s, correct: c };
  }, [quiz, states]);

  const resetAll = () => {
    if (!quiz) return;
    setStates(Object.fromEntries(quiz.questions.map((q) => [q.id, INITIAL_STATE])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!entry) {
    return (
      <div className={s.page}>
        <div className={s.empty}>존재하지 않는 퀴즈입니다.</div>
        <p>
          <Link to="/quiz" className={s.chapterLink}>
            ← 전체 퀴즈 목록으로
          </Link>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.page}>
        <div className={s.empty}>퀴즈를 불러오지 못했습니다: {error}</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={s.page}>
        <div className={s.empty}>로딩 중…</div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Link to="/quiz" className={s.backLink}>
        ← 퀴즈 목록
      </Link>
      <header className={s.header}>
        <div className={s.eyebrow}>
          Ch. {String(quiz.chapterNumber).padStart(2, '0')} · Quiz
        </div>
        <h1 className={s.title}>{quiz.title}</h1>
        {quiz.description && <p className={s.desc}>{quiz.description}</p>}
        <Link to={`/ch/${quiz.slug}`} className={s.chapterLink}>
          본문 다시 보기 →
        </Link>
      </header>

      <div className={s.summaryBar}>
        <span className={s.progressText}>
          채점 대상: {submitted} / {gradable}
        </span>
        <span className={s.scoreText}>정답: {correct} / {gradable}</span>
        <div className={s.summaryActions}>
          <button type="button" className={s.ghostButton} onClick={resetAll}>
            전체 초기화
          </button>
        </div>
      </div>

      {quiz.questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          state={states[q.id] ?? INITIAL_STATE}
          onStateChange={(next) => setStates((prev) => ({ ...prev, [q.id]: next }))}
        />
      ))}
    </div>
  );
}
