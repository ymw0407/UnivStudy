import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// 상대 경로 base — 저장소 이름과 무관하게 GitHub Pages(프로젝트 사이트),
// 사용자 사이트, 로컬 preview 모두에서 자산 경로가 올바르게 잡힌다.
// HashRouter 를 쓰므로 새로고침 시 404 문제도 없다.
//
// remark-math + rehype-katex 로 MDX 안에서 LaTeX 수식을 쓸 수 있다.
//   인라인: $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$
//   블록  : $$ |\psi\rangle = \alpha|0\rangle + \beta|1\rangle $$
// KaTeX CSS 는 main.tsx 에서 import 한다.
export default defineConfig({
  base: './',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
    vanillaExtractPlugin(),
  ],
});
