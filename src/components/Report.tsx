import { useState, type ReactNode } from "react";
import { useReport } from "../state/ReportContext";
import { BookmarkBar } from "./BookmarkBar";
import { GuidesDrawer } from "./GuidesDrawer";
import { Header } from "./Header";
import { MainMenu } from "./MainMenu";
import { ReportCanvas } from "./ReportCanvas";

/**
 * The whole report: app header, the single hamburger menu, a saved-views bar,
 * and the canvas (top strip + chart + matrix + right-hand slicers). Both pages
 * render this same component - the tutorial just starts it blank and coaches
 * the controls.
 */
export function Report({ children }: { children?: ReactNode }) {
  const { builtinBookmarks, activeBookmarkId, applyBookmark } = useReport();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [guideId, setGuideId] = useState<string | null>(null);

  const openGuide = (id: string) => {
    setGuideId(id);
    setGuidesOpen(true);
  };

  return (
    <div className="report">
      <Header onOpenGuides={() => setGuidesOpen(true)} />
      <MainMenu
        open={menuOpen}
        bookmarks={builtinBookmarks}
        activeBookmarkId={activeBookmarkId}
        onApplyBookmark={applyBookmark}
        onClose={() => setMenuOpen(false)}
      />
      <GuidesDrawer
        open={guidesOpen}
        initialGuideId={guideId}
        onClose={() => setGuidesOpen(false)}
        onApplyBookmark={applyBookmark}
      />
      <BookmarkBar onOpenGuide={openGuide} />
      <ReportCanvas onToggleMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      {children}
    </div>
  );
}
