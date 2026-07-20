import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GrainId, MatrixLevel, MeasureId, PlotById, TimeframeId } from "../data/measures";
import { EMPTY_SELECTION, type Selection } from "../data/series";
import type { ListName } from "../data/types";
import {
  BUILTIN_BOOKMARKS,
  loadCustomBookmarks,
  persistCustomBookmarks,
  type BookmarkDef,
} from "./bookmarks";

export const MAX_ADDITIONAL_MEASURES = 12;

interface ReportState {
  selection: Selection;
  /** Bookmark whose selection is currently applied unmodified, if any. */
  activeBookmarkId: string | null;
  builtinBookmarks: BookmarkDef[];
  customBookmarks: BookmarkDef[];
  /** Applied-bookmark history, oldest first (the tutorial reads this). */
  bookmarkHistory: string[];
  annotationVisible: boolean;
  annotationText: string | null;
  setBarMeasure: (id: MeasureId | null) => void;
  setLineMeasure: (id: MeasureId | null) => void;
  setGrain: (grain: GrainId) => void;
  setPlotBy: (plotBy: PlotById) => void;
  toggleMatrixMeasure: (id: MeasureId) => void;
  clearMatrixMeasures: () => void;
  toggleMatrixLevel: (level: MatrixLevel) => void;
  toggleMonth: (monthKey: string) => void;
  setMonths: (months: string[] | null) => void;
  setLists: (lists: ListName[] | null) => void;
  setTimeframe: (tf: TimeframeId) => void;
  applyBookmark: (id: string) => void;
  saveBookmark: (name: string) => BookmarkDef | null;
  deleteBookmark: (id: string) => void;
  setAnnotationVisible: (v: boolean) => void;
  resetSelection: () => void;
}

const ReportContext = createContext<ReportState | null>(null);

export function ReportProvider({
  children,
  initialBookmarkId,
  startBlank = false,
}: {
  children: ReactNode;
  /** Apply this built-in bookmark on mount (the report page default). */
  initialBookmarkId?: string;
  /** Start with everything unselected (the tutorial). */
  startBlank?: boolean;
}) {
  const initial = useMemo(() => {
    if (startBlank) return { selection: EMPTY_SELECTION, active: null as string | null };
    const bm =
      BUILTIN_BOOKMARKS.find((b) => b.id === initialBookmarkId) ?? BUILTIN_BOOKMARKS[0];
    return { selection: bm.selection, active: bm.id };
  }, [initialBookmarkId, startBlank]);

  const [selection, setSelection] = useState<Selection>(initial.selection);
  const [activeBookmarkId, setActiveBookmarkId] = useState<string | null>(initial.active);
  const [customBookmarks, setCustomBookmarks] = useState<BookmarkDef[]>(() =>
    loadCustomBookmarks(),
  );
  const [bookmarkHistory, setBookmarkHistory] = useState<string[]>(
    initial.active ? [initial.active] : [],
  );
  const [annotationVisible, setAnnotationVisible] = useState<boolean>(() => {
    const bm = BUILTIN_BOOKMARKS.find((b) => b.id === initial.active);
    return Boolean(bm?.showAnnotation);
  });
  const [annotationText, setAnnotationText] = useState<string | null>(() => {
    const bm = BUILTIN_BOOKMARKS.find((b) => b.id === initial.active);
    return bm?.annotation ?? null;
  });

  /** Any manual selector change detaches the view from its bookmark. */
  const mutate = useCallback((fn: (prev: Selection) => Selection) => {
    setSelection((prev) => fn(prev));
    setActiveBookmarkId(null);
  }, []);

  const setBarMeasure = useCallback((id: MeasureId | null) => mutate((p) => ({ ...p, barMeasure: id })), [mutate]);
  const setLineMeasure = useCallback((id: MeasureId | null) => mutate((p) => ({ ...p, lineMeasure: id })), [mutate]);
  const setGrain = useCallback((grain: GrainId) => mutate((p) => ({ ...p, grain })), [mutate]);
  const setPlotBy = useCallback((plotBy: PlotById) => mutate((p) => ({ ...p, plotBy })), [mutate]);
  const toggleMatrixMeasure = useCallback(
    (id: MeasureId) =>
      mutate((p) => {
        const has = p.matrixMeasures.includes(id);
        if (!has && p.matrixMeasures.length >= MAX_ADDITIONAL_MEASURES) return p;
        return {
          ...p,
          matrixMeasures: has ? p.matrixMeasures.filter((m) => m !== id) : [...p.matrixMeasures, id],
        };
      }),
    [mutate],
  );
  const clearMatrixMeasures = useCallback(
    () => mutate((p) => (p.matrixMeasures.length === 0 ? p : { ...p, matrixMeasures: [] })),
    [mutate],
  );
  const toggleMatrixLevel = useCallback(
    (level: MatrixLevel) =>
      mutate((p) => {
        const has = p.matrixDrilldown.includes(level);
        const next = has
          ? p.matrixDrilldown.filter((l) => l !== level)
          : [...p.matrixDrilldown, level];
        // Keep the canonical outer-to-inner order (month before send).
        next.sort((a, b) => (a === "month" ? -1 : b === "month" ? 1 : 0));
        return { ...p, matrixDrilldown: next };
      }),
    [mutate],
  );
  const toggleMonth = useCallback(
    (monthKey: string) =>
      mutate((p) => {
        const cur = p.months ?? [];
        const has = cur.includes(monthKey);
        const next = has ? cur.filter((m) => m !== monthKey) : [...cur, monthKey];
        return { ...p, months: next.length === 0 ? null : next };
      }),
    [mutate],
  );
  const setMonths = useCallback((months: string[] | null) => mutate((p) => ({ ...p, months })), [mutate]);
  const setLists = useCallback((lists: ListName[] | null) => mutate((p) => ({ ...p, lists })), [mutate]);
  const setTimeframe = useCallback((timeframe: TimeframeId) => mutate((p) => ({ ...p, timeframe })), [mutate]);

  const applyBookmark = useCallback(
    (id: string) => {
      const bm =
        BUILTIN_BOOKMARKS.find((b) => b.id === id) ??
        customBookmarks.find((b) => b.id === id);
      if (!bm) return;
      setSelection(bm.selection);
      setActiveBookmarkId(bm.id);
      setBookmarkHistory((h) => [...h, bm.id]);
      setAnnotationVisible(Boolean(bm.showAnnotation));
      setAnnotationText(bm.annotation ?? null);
    },
    [customBookmarks],
  );

  const saveBookmark = useCallback(
    (name: string): BookmarkDef | null => {
      const trimmed = name.trim();
      if (!trimmed || (!selection.barMeasure && !selection.lineMeasure)) return null;
      const bm: BookmarkDef = {
        id: `custom-${Date.now()}`,
        name: trimmed,
        menuLabel: trimmed,
        description: "Your saved view.",
        selection,
        builtin: false,
      };
      setCustomBookmarks((prev) => {
        const next = [...prev, bm];
        persistCustomBookmarks(next);
        return next;
      });
      setActiveBookmarkId(bm.id);
      setBookmarkHistory((h) => [...h, bm.id]);
      return bm;
    },
    [selection],
  );

  const deleteBookmark = useCallback((id: string) => {
    setCustomBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      persistCustomBookmarks(next);
      return next;
    });
    setActiveBookmarkId((active) => (active === id ? null : active));
  }, []);

  const resetSelection = useCallback(() => {
    setSelection(EMPTY_SELECTION);
    setActiveBookmarkId(null);
    setAnnotationVisible(false);
    setAnnotationText(null);
  }, []);

  const value: ReportState = {
    selection,
    activeBookmarkId,
    builtinBookmarks: BUILTIN_BOOKMARKS,
    customBookmarks,
    bookmarkHistory,
    annotationVisible,
    annotationText,
    setBarMeasure,
    setLineMeasure,
    setGrain,
    setPlotBy,
    toggleMatrixMeasure,
    clearMatrixMeasures,
    toggleMatrixLevel,
    toggleMonth,
    setMonths,
    setLists,
    setTimeframe,
    applyBookmark,
    saveBookmark,
    deleteBookmark,
    setAnnotationVisible,
    resetSelection,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
}

export function useReport(): ReportState {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used inside a ReportProvider");
  return ctx;
}
