import { useState } from 'react';
import type {
  CodeBlankQuestion,
  EssayQuestion,
  MultipleChoiceQuestion,
  Question,
  ShortAnswerQuestion,
  TrueFalseQuestion,
} from '../../content/quizzes/types';
import { isBlankCorrect, isShortAnswerCorrect } from '../../content/quizzes/types';
import * as s from './Quiz.css';

const TYPE_LABEL: Record<Question['type'], string> = {
  'multiple-choice': '객관식',
  'true-false': 'O / X',
  'short-answer': '단답',
  'code-blank': '코드 빈칸',
  essay: '서술형',
};

// 상태: 제출 여부 + 정답 여부. 서술형은 '정답' 개념이 없으므로 revealed 만.
export type QuestionState = {
  submitted: boolean;
  correct: boolean | null; // null = 서술형 / 채점 불가
  revealed: boolean;
};

export function QuestionCard({
  question,
  index,
  state,
  onStateChange,
}: {
  question: Question;
  index: number;
  state: QuestionState;
  onStateChange: (next: QuestionState) => void;
}) {
  return (
    <article className={s.questionCard} id={question.id}>
      <header className={s.questionHead}>
        <span className={s.questionNumber}>Q{String(index + 1).padStart(2, '0')}</span>
        <span className={s.typeBadge}>{TYPE_LABEL[question.type]}</span>
      </header>
      <div className={s.prompt}>{question.prompt}</div>

      {question.type === 'multiple-choice' && (
        <MultipleChoiceBody question={question} state={state} onStateChange={onStateChange} />
      )}
      {question.type === 'true-false' && (
        <TrueFalseBody question={question} state={state} onStateChange={onStateChange} />
      )}
      {question.type === 'short-answer' && (
        <ShortAnswerBody question={question} state={state} onStateChange={onStateChange} />
      )}
      {question.type === 'code-blank' && (
        <CodeBlankBody question={question} state={state} onStateChange={onStateChange} />
      )}
      {question.type === 'essay' && (
        <EssayBody question={question} state={state} onStateChange={onStateChange} />
      )}
    </article>
  );
}

// ── 객관식 ────────────────────────────────────────────────

function MultipleChoiceBody({
  question,
  state,
  onStateChange,
}: {
  question: MultipleChoiceQuestion;
  state: QuestionState;
  onStateChange: (next: QuestionState) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const locked = state.submitted;

  const submit = () => {
    if (selected === null) return;
    onStateChange({
      submitted: true,
      correct: selected === question.answerIndex,
      revealed: true,
    });
  };

  const reset = () => {
    setSelected(null);
    onStateChange({ submitted: false, correct: null, revealed: false });
  };

  return (
    <div>
      <ul className={s.optionList}>
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const showAsCorrect = locked && i === question.answerIndex;
          const showAsIncorrect = locked && isSelected && i !== question.answerIndex;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={locked}
                onClick={() => setSelected(i)}
                className={`${s.optionButton} ${isSelected ? s.optionSelected : ''} ${
                  showAsCorrect ? s.optionCorrect : ''
                } ${showAsIncorrect ? s.optionIncorrect : ''}`}
                aria-pressed={isSelected}
              >
                <span className={s.optionMark}>{String.fromCharCode(65 + i)}</span>
                <span>{opt.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className={s.actionRow}>
        {!locked && (
          <button
            type="button"
            className={s.primaryButton}
            onClick={submit}
            disabled={selected === null}
          >
            제출
          </button>
        )}
        {locked && (
          <button type="button" className={s.ghostButton} onClick={reset}>
            다시 풀기
          </button>
        )}
      </div>
      {locked && (
        <Feedback correct={state.correct === true} explanation={question.explanation} />
      )}
    </div>
  );
}

// ── True / False ──────────────────────────────────────────

function TrueFalseBody({
  question,
  state,
  onStateChange,
}: {
  question: TrueFalseQuestion;
  state: QuestionState;
  onStateChange: (next: QuestionState) => void;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const locked = state.submitted;

  const submit = () => {
    if (selected === null) return;
    onStateChange({
      submitted: true,
      correct: selected === question.answer,
      revealed: true,
    });
  };

  const reset = () => {
    setSelected(null);
    onStateChange({ submitted: false, correct: null, revealed: false });
  };

  return (
    <div>
      <ul className={s.optionList}>
        {[true, false].map((v) => {
          const isSelected = selected === v;
          const showAsCorrect = locked && v === question.answer;
          const showAsIncorrect = locked && isSelected && v !== question.answer;
          return (
            <li key={String(v)}>
              <button
                type="button"
                disabled={locked}
                onClick={() => setSelected(v)}
                className={`${s.optionButton} ${isSelected ? s.optionSelected : ''} ${
                  showAsCorrect ? s.optionCorrect : ''
                } ${showAsIncorrect ? s.optionIncorrect : ''}`}
              >
                <span className={s.optionMark}>{v ? 'O' : 'X'}</span>
                <span>{v ? '참 (True)' : '거짓 (False)'}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className={s.actionRow}>
        {!locked && (
          <button
            type="button"
            className={s.primaryButton}
            onClick={submit}
            disabled={selected === null}
          >
            제출
          </button>
        )}
        {locked && (
          <button type="button" className={s.ghostButton} onClick={reset}>
            다시 풀기
          </button>
        )}
      </div>
      {locked && (
        <Feedback correct={state.correct === true} explanation={question.explanation} />
      )}
    </div>
  );
}

// ── 단답 ──────────────────────────────────────────────────

function ShortAnswerBody({
  question,
  state,
  onStateChange,
}: {
  question: ShortAnswerQuestion;
  state: QuestionState;
  onStateChange: (next: QuestionState) => void;
}) {
  const [value, setValue] = useState('');
  const locked = state.submitted;

  const submit = () => {
    onStateChange({
      submitted: true,
      correct: isShortAnswerCorrect(value, question.answers),
      revealed: true,
    });
  };

  const reset = () => {
    setValue('');
    onStateChange({ submitted: false, correct: null, revealed: false });
  };

  return (
    <div>
      <input
        type="text"
        className={s.textInput}
        value={value}
        placeholder={question.hint ?? '답을 입력하세요'}
        onChange={(e) => setValue(e.target.value)}
        disabled={locked}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !locked && value.trim()) submit();
        }}
      />
      <div className={s.actionRow}>
        {!locked && (
          <button
            type="button"
            className={s.primaryButton}
            onClick={submit}
            disabled={!value.trim()}
          >
            제출
          </button>
        )}
        {locked && (
          <button type="button" className={s.ghostButton} onClick={reset}>
            다시 풀기
          </button>
        )}
      </div>
      {locked && (
        <Feedback
          correct={state.correct === true}
          explanation={
            (question.explanation ? question.explanation + '\n\n' : '') +
            `정답: ${question.answers[0]}`
          }
        />
      )}
    </div>
  );
}

// ── 코드 빈칸 ─────────────────────────────────────────────

function CodeBlankBody({
  question,
  state,
  onStateChange,
}: {
  question: CodeBlankQuestion;
  state: QuestionState;
  onStateChange: (next: QuestionState) => void;
}) {
  const blankCount = question.segments.filter((seg) => seg.kind === 'blank').length;
  const [values, setValues] = useState<string[]>(() => Array(blankCount).fill(''));
  const locked = state.submitted;

  const submit = () => {
    const blanks = question.segments.filter((seg) => seg.kind === 'blank') as Array<
      { kind: 'blank'; answers: string[]; width?: number }
    >;
    const allCorrect = blanks.every((b, i) => isBlankCorrect(values[i] ?? '', b.answers));
    onStateChange({ submitted: true, correct: allCorrect, revealed: true });
  };

  const reset = () => {
    setValues(Array(blankCount).fill(''));
    onStateChange({ submitted: false, correct: null, revealed: false });
  };

  // 빈칸 인덱스 카운터
  let blankIdx = -1;

  return (
    <div>
      <pre className={s.codeBlock}>
        <code>
          {question.segments.map((seg, i) => {
            if (seg.kind === 'text') {
              return <span key={i}>{seg.text}</span>;
            }
            blankIdx += 1;
            const idx = blankIdx;
            const v = values[idx] ?? '';
            const correct = locked && isBlankCorrect(v, seg.answers);
            const incorrect = locked && !isBlankCorrect(v, seg.answers);
            return (
              <input
                key={i}
                type="text"
                className={`${s.blankInput} ${correct ? s.blankCorrect : ''} ${
                  incorrect ? s.blankIncorrect : ''
                }`}
                style={{ width: `${Math.max(seg.width ?? 8, 6)}ch` }}
                value={v}
                disabled={locked}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                onChange={(e) => {
                  const next = [...values];
                  next[idx] = e.target.value;
                  setValues(next);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !locked) submit();
                }}
              />
            );
          })}
        </code>
      </pre>
      <div className={s.actionRow}>
        {!locked && (
          <button
            type="button"
            className={s.primaryButton}
            onClick={submit}
            disabled={values.every((v) => !v.trim())}
          >
            제출
          </button>
        )}
        {locked && (
          <button type="button" className={s.ghostButton} onClick={reset}>
            다시 풀기
          </button>
        )}
      </div>
      {locked && (
        <Feedback
          correct={state.correct === true}
          explanation={buildBlankExplanation(question)}
        />
      )}
    </div>
  );
}

function buildBlankExplanation(q: CodeBlankQuestion): string {
  const blanks = q.segments.filter((seg) => seg.kind === 'blank') as Array<
    { kind: 'blank'; answers: string[] }
  >;
  const answerLines = blanks
    .map((b, i) => `  [${i + 1}] ${b.answers[0]}`)
    .join('\n');
  return (q.explanation ? q.explanation + '\n\n' : '') + `정답:\n${answerLines}`;
}

// ── 서술형 ─────────────────────────────────────────────────

function EssayBody({
  question,
  state,
  onStateChange,
}: {
  question: EssayQuestion;
  state: QuestionState;
  onStateChange: (next: QuestionState) => void;
}) {
  const [value, setValue] = useState('');
  const { revealed } = state;

  const reveal = () => onStateChange({ submitted: true, correct: null, revealed: true });
  const hide = () => onStateChange({ submitted: false, correct: null, revealed: false });

  return (
    <div>
      <textarea
        className={s.textInput}
        rows={6}
        value={value}
        placeholder="답을 작성해 보세요 (채점은 하지 않습니다)"
        onChange={(e) => setValue(e.target.value)}
        style={{ resize: 'vertical' }}
      />
      <div className={s.actionRow}>
        {!revealed ? (
          <button type="button" className={s.primaryButton} onClick={reveal}>
            모범답안 보기
          </button>
        ) : (
          <button type="button" className={s.ghostButton} onClick={hide}>
            접기
          </button>
        )}
      </div>
      {revealed && (
        <div className={s.modelAnswer}>
          <span className={s.feedbackLabel}>모범답안</span>
          {question.modelAnswer}
          {question.rubric && question.rubric.length > 0 && (
            <ul className={s.rubric}>
              {question.rubric.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ── 피드백 박스 ───────────────────────────────────────────

function Feedback({ correct, explanation }: { correct: boolean; explanation?: string }) {
  return (
    <div
      className={`${s.feedback} ${correct ? s.feedbackCorrect : s.feedbackIncorrect}`}
      role="status"
    >
      <span className={s.feedbackLabel}>{correct ? '정답' : '오답'}</span>
      {explanation}
    </div>
  );
}
