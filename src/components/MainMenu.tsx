import { useEffect, useRef } from "react";
import type { BookmarkDef } from "../state/bookmarks";

/**
 * The hamburger menu, simplified to a single flat list of the four report
 * views. Each item applies its bookmark's pre-selection to the canvas - no
 * page navigation happens. Styled as the target's dark right-side panel, with
 * the active view highlighted.
 */
export function MainMenu({
  open,
  bookmarks,
  activeBookmarkId,
  onApplyBookmark,
  onClose,
}: {
  open: boolean;
  bookmarks: BookmarkDef[];
  activeBookmarkId: string | null;
  onApplyBookmark: (id: string) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Move focus into the flyout on open; return it to the opener on close.
  useEffect(() => {
    if (!open) return;
    const opener =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();
    return () => opener?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="menu-backdrop" onClick={onClose}>
      <nav
        ref={panelRef}
        id="report-menu"
        className="main-menu"
        aria-label="Report views"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menu-head">
          <span className="menu-title">Email Analytics</span>
          <button className="icon-btn menu-close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        <ul className="menu-list" role="list">
          {bookmarks.map((b) => {
            const active = activeBookmarkId === b.id;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  className={active ? "menu-item active" : "menu-item"}
                  aria-current={active ? "true" : undefined}
                  data-tour={b.id === bookmarks[1]?.id ? "menu-item-2" : undefined}
                  onClick={() => {
                    onApplyBookmark(b.id);
                    onClose();
                  }}
                >
                  <span className="menu-item-label">{b.menuLabel}</span>
                  <span className="menu-item-desc">{b.description}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="menu-foot">One canvas, four saved views. Choosing a view applies its selectors to the report.</p>
      </nav>
    </div>
  );
}
