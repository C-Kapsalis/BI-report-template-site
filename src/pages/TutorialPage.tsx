import { Report } from "../components/Report";
import { ReportProvider } from "../state/ReportContext";
import { TutorialOverlay } from "../tutorial/TutorialOverlay";

export function TutorialPage() {
  return (
    <ReportProvider startBlank>
      <Report>
        <TutorialOverlay />
      </Report>
    </ReportProvider>
  );
}
