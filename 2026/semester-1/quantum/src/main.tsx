import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';

import 'katex/dist/katex.min.css';
import './styles/theme.css';
import './styles/global.css';

import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { mdxComponents } from './mdxComponents';

const Chapter = lazy(() => import('./pages/Chapter').then((m) => ({ default: m.Chapter })));
const Quiz = lazy(() => import('./pages/Quiz').then((m) => ({ default: m.Quiz })));

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
              path="quiz"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Quiz />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </MDXProvider>
  </StrictMode>,
);
