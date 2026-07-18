import { useEffect, useRef, useState } from "react";
import { useReport } from "../state/ReportContext";

export function BookmarkBar({ onOpenGuide }: { onOpenGuide: (guideId: string) => void }) {
  const {
    builtinBookmarks,
    customBookmarks,
    activeBookmarkId,
    applyBookmark,
    saveBookmark,
    deleteBookmark,
    selection,
  } = useReport();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const wasSaving = useRef(false);

  const canSave = Boolean(selection.axis) && selection.measures.length > 0;

  // When the save form closes (saved or cancelled), return focus to the
  // save button so keyboard users are not dropped at the page root.
  useEffect(() => {
    if (saving) {
      wasSaving.current = true;
    } else if (wasSaving.current) {
      wasSaving.current = false;
      addBtnRef.current?.focus();
    }
  }, [saving]);

  const submit = () => {
    if (saveBookmark(name)) {
      setName("");
      setSaving(false);
    }
  };

  return (
    <div className="bookmark-bar" data-tour="bookmarks">
      <span className="bookmark-bar-label">Bookmarks</span>
      {builtinBookmarks.map((b) => (
        <span
          key={b.id}
          className={activeBookmarkId === b.id ? "bookmark-chip active" : "bookmark-chip"}
        >
          <button
            className="bookmark-apply"
            title={b.description}
            onClick={() => applyBookmark(b.id)}
          >
            {b.name}
          </button>
          {b.guideId && (
            <button
              className="bookmark-guide"
              title={`Guide: ${b.name}`}
              aria-label={`Read the guide for ${b.name}`}
              onClick={() => onOpenGuide(b.guideId!)}
            >
              📖
            </button>
          )}
        </span>
      ))}
      {customBookmarks.map((b) => (
        <span
          key={b.id}
          className={
            activeBookmarkId === b.id
              ? "bookmark-chip custom active"
              : "bookmark-chip custom"
          }
          data-tour="custom-bookmark"
        >
          <button className="bookmark-apply" title={b.description} onClick={() => applyBookmark(b.id)}>
            {b.name}
          </button>
          <button
            className="bookmark-guide"
            title={`Delete ${b.name}`}
            aria-label={`Delete bookmark ${b.name}`}
            onClick={() => deleteBookmark(b.id)}
          >
            ✕
          </button>
        </span>
      ))}
      {saving ? (
        <span className="bookmark-save-form" data-tour="save-bookmark">
          <input
            autoFocus
            value={name}
            aria-label="Bookmark name"
            placeholder="Name this view"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setSaving(false);
            }}
          />
          <button
            className="header-btn"
            onClick={submit}
            disabled={!name.trim()}
            title={name.trim() ? "Save this bookmark" : "Enter a name for the bookmark first"}
          >
            Save
          </button>
          <button className="icon-btn" onClick={() => setSaving(false)} aria-label="Cancel saving">
            ✕
          </button>
        </span>
      ) : (
        <button
          ref={addBtnRef}
          className="bookmark-add"
          data-tour="save-bookmark"
          disabled={!canSave}
          title={
            canSave
              ? "Save the current selection as a bookmark"
              : "Saving is unavailable: pick a plot axis and at least one measure first"
          }
          onClick={() => setSaving(true)}
        >
          + Save current view
          {!canSave && (
            <span className="visually-hidden">
              {" "}
              (unavailable — pick a plot axis and at least one measure first)
            </span>
          )}
        </button>
      )}
    </div>
  );
}
