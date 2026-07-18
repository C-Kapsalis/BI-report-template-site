import { Link, useLocation } from "react-router-dom";

export function Header({
  onToggleMenu,
  onOpenGuides,
  onToggleInfo,
  infoActive,
  menuOpen,
}: {
  onToggleMenu: () => void;
  onOpenGuides: () => void;
  onToggleInfo: () => void;
  infoActive: boolean;
  menuOpen: boolean;
}) {
  const { pathname } = useLocation();
  return (
    <header className="header">
      <button
        className="hamburger"
        onClick={onToggleMenu}
        aria-label="Report menu"
        aria-expanded={menuOpen}
        aria-controls="report-menu"
        data-tour="menu"
      >
        ☰
      </button>
      <div className="brand">
        <span className="brand-mark" aria-hidden>
          🍃
        </span>
        <h1 className="brand-name">Email Marketing Report</h1>
        <span className="brand-sub">One-canvas template</span>
      </div>
      <nav className="header-nav" aria-label="Pages">
        <Link
          to="/"
          className={pathname === "/" ? "nav-link active" : "nav-link"}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Report
        </Link>
        <Link
          to="/tutorial"
          className={pathname === "/tutorial" ? "nav-link active" : "nav-link"}
          aria-current={pathname === "/tutorial" ? "page" : undefined}
        >
          Tutorial
        </Link>
        <button
          className={infoActive ? "header-btn active" : "header-btn"}
          onClick={onToggleInfo}
          aria-pressed={infoActive}
        >
          Info
        </button>
        <button className="header-btn" onClick={onOpenGuides}>
          Guides
        </button>
      </nav>
    </header>
  );
}
