import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// GitHub Pages 배포 대상: https://ymw0407.github.io/OS-Summary/
// - production build 에서만 /OS-Summary/ 를 base 로 사용
// - local dev 는 "/" 로 두어 편의상 그대로 http://localhost:5173/ 로 접근
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/OS-Summary/' : '/',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: '@mdx-js/react' }) },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
    vanillaExtractPlugin(),
  ],
}));
