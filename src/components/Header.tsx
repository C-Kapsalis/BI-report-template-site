import { Link, useLocation } from "react-router-dom";
import { useReport } from "../state/ReportContext";

/**
 * The app chrome header: the product name (the page h1), the Report/Tutorial
 * route links, and the Info / Guides controls. The report's own view menu lives
 * in the canvas top strip (the hamburger), matching the target report.
 */
export function Header({ onOpenGuides }: { onOpenGuides: () => void }) {
  const { pathname } = useLocation();
  const { annotationVisible, setAnnotationVisible } = useReport();
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark" aria-hidden>◆</span>
        <h1 className="brand-name">Email Marketing Report</h1>
        <span className="brand-sub">One-canvas template</span>
      </div>
      <nav className="header-nav" aria-label="Pages">
        <Link to="/" className={pathname === "/" ? "nav-link active" : "nav-link"} aria-current={pathname === "/" ? "page" : undefined}>
          Report
        </Link>
        <Link to="/tutorial" className={pathname === "/tutorial" ? "nav-link active" : "nav-link"} aria-current={pathname === "/tutorial" ? "page" : undefined}>
          Tutorial
        </Link>
        <button
          className={annotationVisible ? "header-btn active" : "header-btn"}
          onClick={() => setAnnotationVisible(!annotationVisible)}
          aria-pressed={annotationVisible}
        >
          Info
        </button>
        <button className="header-btn" onClick={onOpenGuides}>Guides</button>
      </nav>
    </header>
  );
}
