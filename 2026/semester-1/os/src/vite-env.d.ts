/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const MDXComponent: ComponentType<{ components?: Record<string, ComponentType<unknown>> }>;
  export default MDXComponent;
}
