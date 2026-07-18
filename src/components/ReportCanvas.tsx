import { useMemo } from "react";
import { buildChart, buildMatrices } from "../data/series";
import { useReport } from "../state/ReportContext";
import { ComboChart } from "./ComboChart";
import { MatrixTable } from "./MatrixTable";

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p className="empty-body">{body}</p>
    </div>
  );
}

export function ReportCanvas() {
  const { selection, annotationVisible, annotationText, setAnnotationVisible, activeBookmarkId, builtinBookmarks, customBookmarks } =
    useReport();

  const chart = useMemo(() => buildChart(selection), [selection]);
  const matrices = useMemo(() => buildMatrices(selection), [selection]);

  const activeBookmark =
    builtinBookmarks.find((b) => b.id === activeBookmarkId) ??
    customBookmarks.find((b) => b.id === activeBookmarkId) ??
    null;

  const blank = !selection.axis || selection.measures.length === 0;

  return (
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
              "This template draws everything you see from the selector panel: one chart and one matrix, redrawn from whatever axis, legend and measures are selected. Bookmarks are saved selections - nothing else."}
          </div>
          <button
            className="icon-btn"
            onClick={() => setAnnotationVisible(false)}
            aria-label="Hide info note"
          >
            ✕
          </button>
        </div>
      )}

      {chart.notices.map((n) => (
        <div key={n} className="notice" role="status">
          {n}
        </div>
      ))}

      <section className="card chart-card">
        {blank ? (
          <EmptyState
            title={!selection.axis ? "No plot axis selected" : "No measures selected"}
            body={
              !selection.axis
                ? "Pick a plot axis in the selector panel - Month is the usual starting point."
                : "Pick one or more measures - try Emails Delivered and Open Rate %."
            }
          />
        ) : chart.panes.length === 0 ? (
          <EmptyState
            title="Nothing to plot for this combination"
            body="The selected measures don't apply to this axis or legend - see the note above."
          />
        ) : (
          <ComboChart model={chart} />
        )}
      </section>

      <section className="card matrix-card">
        {blank ? (
          <EmptyState
            title="The matrix follows the same selection"
            body="Once measures are selected, every campaign send appears here as a row with the selected measures as columns."
          />
        ) : matrices.length === 0 ? (
          <EmptyState title="No rows for this selection" body="Widen the timeframe or change the measures." />
        ) : (
          matrices.map((m) => <MatrixTable key={m.title} model={m} />)
        )}
      </section>
    </main>
  );
}
