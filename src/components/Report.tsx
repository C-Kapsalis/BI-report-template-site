import { useState, type ReactNode } from "react";
import { useReport } from "../state/ReportContext";
import { BookmarkBar } from "./BookmarkBar";
import { GuidesDrawer } from "./GuidesDrawer";
import { Header } from "./Header";
import { MainMenu } from "./MainMenu";
import { ReportCanvas } from "./ReportCanvas";
import { SelectorPanel } from "./SelectorPanel";

/**
 * The whole report: header, hamburger menu, bookmark bar, selector panel and
 * the single canvas. Both pages render this same component - the tutorial
 * just starts it blank and coaches the controls.
 */
export function Report({ children }: { children?: ReactNode }) {
  const { builtinBookmarks, applyBookmark, annotationVisible, setAnnotationVisible } =
    useReport();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [guideId, setGuideId] = useState<string | null>(null);

  const openGuide = (id: string) => {
    setGuideId(id);
    setGuidesOpen(true);
  };

  return (
    <div className="report">
      <Header
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onOpenGuides={() => setGuidesOpen(true)}
        onToggleInfo={() => setAnnotationVisible(!annotationVisible)}
        infoActive={annotationVisible}
        menuOpen={menuOpen}
      />
      <MainMenu
        open={menuOpen}
        bookmarks={builtinBookmarks}
        onApplyBookmark={applyBookmark}
        onOpenGuide={openGuide}
        onClose={() => setMenuOpen(false)}
      />
      <GuidesDrawer
        open={guidesOpen}
        initialGuideId={guideId}
        onClose={() => setGuidesOpen(false)}
        onApplyBookmark={applyBookmark}
      />
      <BookmarkBar onOpenGuide={openGuide} />
      <div className="report-body">
        <SelectorPanel />
        <ReportCanvas />
      </div>
      {children}
    </div>
  );
}
