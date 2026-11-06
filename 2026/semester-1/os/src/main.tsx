import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';

import './styles/theme.css';
import './styles/global.css';

import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { mdxComponents } from './mdxComponents';

const Chapter = lazy(() => import('./pages/Chapter').then((m) => ({ default: m.Chapter })));
const SchedulerEvolution = lazy(() =>
  import('./pages/SchedulerEvolution').then((m) => ({ default: m.SchedulerEvolution })),
);
const MemoryEvolution = lazy(() =>
  import('./pages/MemoryEvolution').then((m) => ({ default: m.MemoryEvolution })),
);
const QuizOverview = lazy(() =>
  import('./pages/QuizOverview').then((m) => ({ default: m.QuizOverview })),
);
const ChapterQuiz = lazy(() =>
  import('./pages/ChapterQuiz').then((m) => ({ default: m.ChapterQuiz })),
);

function PageFallback() {
  return <div style={{ padding: '48px', opacity: 0.6 }}>로딩 중…</div>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MDXProvider components={mdxComponents}>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="ch/:slug"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Chapter />
                </Suspense>
              }
            />
            <Route
              path="evolution/scheduler"
              element={
                <Suspense fallback={<PageFallback />}>
                  <SchedulerEvolution />
                </Suspense>
              }
            />
            <Route
              path="evolution/memory"
              element={
                <Suspense fallback={<PageFallback />}>
                  <MemoryEvolution />
                </Suspense>
              }
            />
            <Route
              path="quiz"
              element={
                <Suspense fallback={<PageFallback />}>
                  <QuizOverview />
                </Suspense>
              }
            />
            <Route
              path="quiz/:slug"
              element={
                <Suspense fallback={<PageFallback />}>
                  <ChapterQuiz />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </MDXProvider>
  </StrictMode>,
);
