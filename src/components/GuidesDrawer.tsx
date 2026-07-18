import { useEffect, useRef, useState } from "react";
import { GLOSSARY, GUIDES } from "./guides";

export function GuidesDrawer({
  open,
  initialGuideId,
  onClose,
  onApplyBookmark,
}: {
  open: boolean;
  initialGuideId: string | null;
  onClose: () => void;
  onApplyBookmark: (bookmarkId: string) => void;
}) {
  const [tab, setTab] = useState<string>(initialGuideId ?? GUIDES[0].id);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && initialGuideId) setTab(initialGuideId);
  }, [open, initialGuideId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Move focus into the drawer on open; return it to the opener on close.
  useEffect(() => {
    if (!open) return;
    const opener =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();
    return () => opener?.focus();
  }, [open]);

  if (!open) return null;

  const guide = GUIDES.find((g) => g.id === tab);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        ref={panelRef}
        className="drawer"
        role="dialog"
        aria-label="Topic guides"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <h2>Guides</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close guides">
            ✕
          </button>
        </div>
        <div className="drawer-tabs" role="tablist" aria-label="Guide topics">
          {GUIDES.map((g) => (
            <button
              key={g.id}
              id={`guide-tab-${g.id}`}
              role="tab"
              aria-selected={tab === g.id}
              aria-controls="guide-panel"
              className={tab === g.id ? "tab active" : "tab"}
              onClick={() => setTab(g.id)}
            >
              {g.title}
            </button>
          ))}
          <button
            id="guide-tab-glossary"
            role="tab"
            aria-selected={tab === "glossary"}
            aria-controls="guide-panel"
            className={tab === "glossary" ? "tab active" : "tab"}
            onClick={() => setTab("glossary")}
          >
            Glossary
          </button>
        </div>
        <div
          className="drawer-body"
          id="guide-panel"
          role="tabpanel"
          aria-labelledby={`guide-tab-${tab}`}
        >
          {tab === "glossary" ? (
            <dl className="glossary">
              {GLOSSARY.map((e) => (
                <div key={e.term} className="glossary-entry">
                  <dt>{e.term}</dt>
                  <dd>{e.definition}</dd>
                </div>
              ))}
            </dl>
          ) : guide ? (
            <article className="guide">
              {guide.bookmarkId && (
                <button
                  className="apply-bookmark-btn"
                  onClick={() => {
                    onApplyBookmark(guide.bookmarkId!);
                    onClose();
                  }}
                >
                  Open the matching bookmark →
                </button>
              )}
              {guide.body}
            </article>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
