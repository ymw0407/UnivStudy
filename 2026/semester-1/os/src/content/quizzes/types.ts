// 퀴즈 스키마.
// - 각 챕터마다 하나의 QuizSet 을 export.
// - 문항 타입별로 채점 방식이 다르다:
//   • multiple-choice : 단일 정답 인덱스 비교
//   • true-false      : boolean 비교
//   • short-answer    : 정규화 후 허용된 정답 집합에 포함되는지
//   • code-blank      : 각 blank 별 정규화 비교 (전부 맞아야 정답)
//   • essay           : 채점하지 않고 모범답안만 공개

export type ChoiceOption = {
  text: string;
};

export type MultipleChoiceQuestion = {
  id: string;
  type: 'multiple-choice';
  prompt: string;
  options: ChoiceOption[];
  answerIndex: number;
  explanation?: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: 'true-false';
  prompt: string;
  answer: boolean;
  explanation?: string;
};

export type ShortAnswerQuestion = {
  id: string;
  type: 'short-answer';
  prompt: string;
  // 허용 정답들. 대소문자/공백 정규화 후 이 집합에 속하면 정답.
  answers: string[];
  // 보조 힌트 문구 (placeholder 로 표시)
  hint?: string;
  explanation?: string;
};

export type CodeBlankQuestion = {
  id: string;
  type: 'code-blank';
  prompt: string;
  // 코드 조각을 블록으로 나열 — 'text' 는 그대로 출력, 'blank' 는 입력 칸.
  segments: Array<{ kind: 'text'; text: string } | { kind: 'blank'; answers: string[]; width?: number }>;
  language?: 'c' | 'cpp' | 'python' | 'text';
  explanation?: string;
};

export type EssayQuestion = {
  id: string;
  type: 'essay';
  prompt: string;
  // 모범답안 — 공개 시 그대로 표시.
  modelAnswer: string;
  rubric?: string[];
};

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | CodeBlankQuestion
  | EssayQuestion;

export type QuizSet = {
  slug: string;            // chapter slug, e.g., '01-processes'
  chapterNumber: number;
  title: string;           // 보여줄 퀴즈 타이틀
  description?: string;
  questions: Question[];
};

// ── 채점 유틸 ────────────────────────────────────────────────

function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isShortAnswerCorrect(input: string, allowed: string[]): boolean {
  const n = normalizeText(input);
  return allowed.some((a) => normalizeText(a) === n);
}

export function isBlankCorrect(input: string, allowed: string[]): boolean {
  const n = input.trim();
  const nlc = n.toLowerCase();
  return allowed.some((a) => a.trim() === n || a.trim().toLowerCase() === nlc);
}
