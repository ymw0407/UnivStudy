import { Prism } from "prism-react-renderer";

// prism-react-renderer 2.x bundles a limited set of languages (no java/c#/etc).
// Expose the bundled Prism instance on globalThis so that
// `prismjs/components/prism-xxx` side-effect imports can register their grammar
// against it. This file must be imported BEFORE any prismjs component import.
(globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
