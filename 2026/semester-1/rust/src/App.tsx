import type { ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import { IndexPage } from "./pages/IndexPage";
import { Step1Intro } from "./pages/Step1Intro";
import { Step2Setup } from "./pages/Step2Setup";
import { Step3Basics } from "./pages/Step3Basics";
import { Step4Ownership } from "./pages/Step4Ownership";
import { Step5Types } from "./pages/Step5Types";
import { Step7Generics } from "./pages/Step7Generics";
import { Step8Advanced } from "./pages/Step8Advanced";

const stepRoutes: { step: number; element: ReactElement }[] = [
  { step: 1, element: <Step1Intro /> },
  { step: 2, element: <Step2Setup /> },
  { step: 3, element: <Step3Basics /> },
  { step: 4, element: <Step4Ownership /> },
  { step: 5, element: <Step5Types /> },
  { step: 7, element: <Step7Generics /> },
  { step: 8, element: <Step8Advanced /> },
];

export function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      {stepRoutes.map(({ step, element }) => (
        <Route key={step} path={`/step/${step}`} element={element} />
      ))}
    </Routes>
  );
}
