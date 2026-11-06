import { useMemo, useState } from 'react';
import { quiz, type QuizQuestion } from '../content/quiz';
import { chapters } from '../content/manifest';
import * as s from './Quiz.css';

function ChoiceList({
  q,
  picked,
  onPick,
}: {
  q: QuizQuestion;
  picked: number | undefined;
  onPick: (i: number) => void;
}) {
  const answered = picked !== undefined;
  return (
    <ul className={s.choices}>
      {q.choices.map((c, i) => {
        const isAnswer = i === q.answer;
        const isPicked = i === picked;
        let cls = s.choice;
        if (answered && isAnswer) cls = `${s.choice} ${s.choiceCorrect}`;
        else if (answered && isPicked && !isAnswer) cls = `${s.choice} ${s.choiceWrong}`;
        return (
          <li key={i}>
            <button
              type="button"
              className={cls}
              onClick={() => !answered && onPick(i)}
              disabled={answered}
            >
              <span className={s.choiceMark}>
                {answered && isAnswer ? '✓' : answered && isPicked ? '✗' : String.fromCharCode(65 + i)}
              </span>
              <span>{c}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function Quiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<number | 'all'>('all');

  const chaptersWithQuiz = useMemo(
    () => chapters.filter((c) => quiz.some((q) => q.chapter === c.number)),
    [],
  );

  const visible = useMemo(
    () => (filter === 'all' ? quiz : quiz.filter((q) => q.chapter === filter)),
    [filter],
  );

  const attempted = Object.keys(answers).length;
  const correct = quiz.filter((q) => answers[q.id] === q.answer).length;

  // 화면에 보일 문항을 장별로 그룹화
  const grouped = useMemo(() => {
    const map = new Map<number, QuizQuestion[]>();
    for (const q of visible) {
      const arr = map.get(q.chapter) ?? [];
      arr.push(q);
      map.set(q.chapter, arr);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [visible]);

  const titleOf = (n: number) => chapters.find((c) => c.number === n)?.title ?? `${n}장`;

  return (
    <div className={s.root}>
      <header className={s.head}>
        <div className={s.eyebrow}>Quiz · 시험 대비 문제</div>
        <h1 className={s.title}>스스로 점검하기</h1>
        <p className={s.desc}>
          각 장의 핵심 개념을 객관식으로 정리했습니다. 보기를 누르면 정답·해설이 바로 표시됩니다.
          총 {quiz.length}문항.
        </p>
        <div className={s.scoreBar}>
          <span className={s.score}>
            맞춘 개수 <strong>{correct}</strong> / 시도 {attempted} (전체 {quiz.length})
          </span>
          {attempted > 0 && (
            <button type="button" className={s.reset} onClick={() => setAnswers({})}>
              ↺ 다시 풀기
            </button>
          )}
        </div>
      </header>

      <div className={s.filters}>
        <button
          type="button"
          className={`${s.chip} ${filter === 'all' ? s.chipActive : ''}`}
          onClick={() => setFilter('all')}
        >
          전체
        </button>
        {chaptersWithQuiz.map((c) => (
          <button
            key={c.number}
            type="button"
            className={`${s.chip} ${filter === c.number ? s.chipActive : ''}`}
            onClick={() => setFilter(c.number)}
          >
            {String(c.number).padStart(2, '0')}. {c.title}
          </button>
        ))}
      </div>

      {grouped.map(([chapter, qs]) => (
        <section key={chapter} className={s.section}>
          <h2 className={s.sectionTitle}>
            <span className={s.sectionNum}>Ch. {String(chapter).padStart(2, '0')}</span>
            {titleOf(chapter)}
          </h2>
          {qs.map((q) => {
            const picked = answers[q.id];
            const answered = picked !== undefined;
            return (
              <div key={q.id} className={s.card}>
                <div className={s.question}>{q.question}</div>
                <ChoiceList
                  q={q}
                  picked={picked}
                  onPick={(i) => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                />
                {answered && (
                  <div
                    className={`${s.explain} ${picked === q.answer ? s.explainOk : s.explainNo}`}
                  >
                    <span className={s.explainTag}>{picked === q.answer ? '정답' : '오답'}</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
