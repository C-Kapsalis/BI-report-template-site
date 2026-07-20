import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * A slicer-style dropdown: a button showing the current value that opens a
 * popover panel. Closes on Escape, outside click, or blur. The panel content
 * is supplied by the caller (a checkbox list, a search box, etc.).
 */
export function Dropdown({
  label,
  value,
  children,
  tourId,
  align = "left",
}: {
  /** Accessible name for the trigger button. */
  label: string;
  /** Text shown in the closed trigger (e.g. "Multiple selections"). */
  value: string;
  children: (close: () => void) => ReactNode;
  tourId?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="dropdown" ref={wrapRef} data-tour={tourId}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={`${label}: ${value}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dropdown-value">{value}</span>
        <span className="dropdown-caret" aria-hidden>▾</span>
      </button>
      {open && (
        <div id={panelId} className={`dropdown-panel ${align}`} role="group" aria-label={label}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
