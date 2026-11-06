import { Callout } from './components/Callout/Callout';
import { MdxPre } from './components/CodeBlock/CodeBlock';
import { Figure } from './components/Figure/Figure';
import { Eq } from './components/Eq/Eq';

// MDXProvider 는 느슨한 components map 을 받으므로 unknown 캐스팅으로 유연하게 둔다.
export const mdxComponents = {
  Callout,
  Figure,
  Eq,
  pre: MdxPre,
} as unknown as Record<string, React.ComponentType<unknown>>;
