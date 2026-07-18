import { Report } from "../components/Report";
import { ReportProvider } from "../state/ReportContext";

export function ReportPage() {
  return (
    <ReportProvider initialBookmarkId="email-overview">
      <Report />
    </ReportProvider>
  );
}
