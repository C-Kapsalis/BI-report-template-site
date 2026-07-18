import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReportPage } from "./pages/ReportPage";
import { TutorialPage } from "./pages/TutorialPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="*" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
