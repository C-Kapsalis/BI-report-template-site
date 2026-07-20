import { useMemo } from "react";
import { buildChart, buildMatrix } from "../data/series";
import { useReport } from "../state/ReportContext";
import { ComboChart } from "./ComboChart";
import { MatrixSelectors } from "./MatrixSelectors";
import { MatrixTable } from "./MatrixTable";
import { RightPanel } from "./RightPanel";
import { TopStrip } from "./TopStrip";

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p className="empty-body">{body}</p>
    </div>
  );
}

export function ReportCanvas({
  onToggleMenu,
  menuOpen,
}: {
  onToggleMenu: () => void;
  menuOpen: boolean;
}) {
  const {
    selection,
    annotationVisible,
    annotationText,
    setAnnotationVisible,
    activeBookmarkId,
    builtinBookmarks,
    customBookmarks,
  } = useReport();

  const chart = useMemo(() => buildChart(selection), [selection]);
  const matrix = useMemo(() => buildMatrix(selection), [selection]);

  const activeBookmark =
    builtinBookmarks.find((b) => b.id === activeBookmarkId) ??
    customBookmarks.find((b) => b.id === activeBookmarkId) ??
    null;

  const blank = !selection.barMeasure && !selection.lineMeasure;

  return (
    <>
      <TopStrip onToggleMenu={onToggleMenu} menuOpen={menuOpen} />

      <div className="report-body">
        <main className="canvas" data-tour="canvas">
          <div className="canvas-title-row">
            <h2 className="canvas-title">
              {activeBookmark ? activeBookmark.name : blank ? "Blank canvas" : "Custom view"}
            </h2>
            {activeBookmark && <p className="canvas-desc">{activeBookmark.description}</p>}
          </div>

          {annotationVisible && (
            <div className="annotation" role="note">
              <div className="annotation-body">
                {annotationText ??
                  "This template draws everything you see from the selectors: one chart and one matrix, redrawn from whatever Set Bars, Set Lines and Plot By values are chosen. Bookmarks are saved selections - nothing else."}
              </div>
              <button className="icon-btn" onClick={() => setAnnotationVisible(false)} aria-label="Hide info note">✕</button>
            </div>
          )}

          {chart.notices.map((nt) => (
            <div key={nt} className="notice" role="status">{nt}</div>
          ))}

          <section className="card chart-card" aria-label="Combo chart">
            {blank ? (
              <EmptyState
                title="No measures selected"
                body="Pick a measure in Set Bars (columns) or Set Lines (line) above - try Emails Sent # and Emails Delivered #."
              />
            ) : (
              <ComboChart model={chart} />
            )}
          </section>

          <MatrixSelectors />

          <section className="card matrix-card" aria-label="Drilldown matrix" data-tour="matrix">
            <MatrixTable model={matrix} />
          </section>
        </main>

        <RightPanel />
      </div>
    </>
  );
}
