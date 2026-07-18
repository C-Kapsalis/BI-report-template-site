import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReport } from "../state/ReportContext";
import { TUTORIAL_STEPS, type StepCtx } from "./steps";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Coach-mark overlay for the tutorial: spotlights the active control with a
 * ring (the page stays fully interactive), and gates Next on each step's
 * completion condition.
 */
export function TutorialOverlay() {
  const report = useReport();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Move focus to the coach card once, when the tutorial opens, so keyboard
  // and screen-reader users start at the instructions. Later steps leave
  // focus wherever the user is working - the live region announces changes.
  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  const step = TUTORIAL_STEPS[stepIndex];

  const ctx: StepCtx = {
    selection: report.selection,
    activeBookmarkId: report.activeBookmarkId,
    customBookmarks: report.customBookmarks,
    builtinIds: report.builtinBookmarks.map((b) => b.id),
  };
  const complete = step.isComplete(ctx);

  const measure = useCallback(() => {
    if (!step.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step.target]);

  useEffect(() => {
    measure();
    const id = window.setInterval(measure, 350);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  useEffect(() => {
    if (step.target) {
      document
        .querySelector(`[data-tour="${step.target}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [step.target]);

  const last = stepIndex === TUTORIAL_STEPS.length - 1;

  // Card placement: under the spotlight when it fits, otherwise fixed bottom-right.
  const cardStyle: React.CSSProperties = rect
    ? rect.top + rect.height + 240 < window.innerHeight
      ? { top: rect.top + rect.height + 12, left: Math.min(rect.left, window.innerWidth - 400) }
      : { top: Math.max(12, rect.top - 240), left: Math.min(rect.left + rect.width + 12, window.innerWidth - 400) }
    : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  return (
    <>
      {rect && (
        <div
          className="coach-spotlight"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
          }}
          aria-hidden
        />
      )}
      <div
        ref={cardRef}
        className="coach-card"
        style={cardStyle}
        role="dialog"
        aria-label="Tutorial step"
        tabIndex={-1}
      >
        <div className="coach-progress">
          {TUTORIAL_STEPS.map((s, i) => (
            <span key={s.id} className={i <= stepIndex ? "dot filled" : "dot"} aria-hidden />
          ))}
          <span className="coach-count" aria-hidden>
            {stepIndex + 1}/{TUTORIAL_STEPS.length}
          </span>
        </div>
        <div aria-live="polite" aria-atomic="true">
          <p className="visually-hidden">
            Step {stepIndex + 1} of {TUTORIAL_STEPS.length}
          </p>
          <h2>{step.title}</h2>
          <p>{step.body}</p>
          {!complete && step.todo && (
            <p className="coach-todo">
              <span aria-hidden>→</span> {step.todo}
            </p>
          )}
        </div>
        <div className="coach-actions">
          <button
            className="header-btn"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            Back
          </button>
          {last ? (
            <button className="coach-next" onClick={() => navigate("/")}>
              Open the report
            </button>
          ) : (
            <button
              className="coach-next"
              disabled={!complete}
              onClick={() => setStepIndex((i) => Math.min(TUTORIAL_STEPS.length - 1, i + 1))}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}
