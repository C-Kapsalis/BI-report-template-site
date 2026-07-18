import { useEffect, useRef, useState } from "react";
import type { BookmarkDef } from "../state/bookmarks";

/**
 * The hamburger flyout: a channel index in the tradition of single-canvas
 * report templates. Every marketing channel has a slot; in this demo only
 * the Email submenu is stocked. Selecting an email view applies its bookmark
 * to the one canvas - no page navigation happens.
 */

const PLACEHOLDER_CHANNELS = [
  "Overview",
  "Spend",
  "Web Analytics",
  "Search (SEO)",
  "Paid Search",
  "Social Media",
  "Competition",
  "Site Speed",
  "Video",
];

export function MainMenu({
  open,
  bookmarks,
  onApplyBookmark,
  onOpenGuide,
  onClose,
}: {
  open: boolean;
  bookmarks: BookmarkDef[];
  onApplyBookmark: (id: string) => void;
  onOpenGuide: (guideId: string) => void;
  onClose: () => void;
}) {
  const [emailOpen, setEmailOpen] = useState(true);
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
        aria-label="Report menu"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menu-head">
          <span className="menu-title">Channels</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <ul className="menu-list">
          {PLACEHOLDER_CHANNELS.map((c) => (
            <li key={c}>
              <span className="menu-item placeholder">
                {c}
                <span className="menu-tag">in template</span>
              </span>
            </li>
          ))}
          <li>
            <button
              className="menu-item email"
              aria-expanded={emailOpen}
              onClick={() => setEmailOpen((v) => !v)}
            >
              Email Marketing
              <span className="menu-caret" aria-hidden>
                {emailOpen ? "▾" : "▸"}
              </span>
            </button>
            {emailOpen && (
              <ul className="submenu">
                {bookmarks.map((b) => (
                  <li key={b.id} className="submenu-row">
                    <button
                      className="submenu-item"
                      onClick={() => {
                        onApplyBookmark(b.id);
                        onClose();
                      }}
                    >
                      <span className="submenu-name">{b.name}</span>
                      <span className="submenu-desc">{b.description}</span>
                    </button>
                    {b.guideId && (
                      <button
                        className="icon-btn guide-icon"
                        title={`Read the guide for ${b.name}`}
                        aria-label={`Read the guide for ${b.name}`}
                        onClick={() => {
                          onOpenGuide(b.guideId!);
                          onClose();
                        }}
                      >
                        📖
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <p className="menu-foot">
          One canvas, many views. The other channels are part of the template layout - this
          demo stocks the Email submenu.
        </p>
      </nav>
    </div>
  );
}
