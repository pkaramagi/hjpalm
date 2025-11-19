import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "tabler-react-ui";
import {
  IconBooks,
  IconSearch,
  IconEye,
} from "@tabler/icons-react";

import { useResumeRecords } from "@/features/resume/hooks/useResumeRecords";
import { useResumeStats } from "@/features/resume/hooks/useResumeStats";
import { QuickActionCards, type QuickAction } from "@/features/resume/components/cards/QuickActionCards";
import { ResumeStatsCard } from "@/features/resume/components/cards/ResumeStatsCard";
import { RecentResumesList } from "@/features/resume/components/cards/RecentResumesList";

export function ResumeHomePage() {
  const { records, loading, error, reload } = useResumeRecords();
  const stats = useResumeStats(records);

  const firstRecordId = records[0]?.recordId;
  const builderTarget = firstRecordId ? `/resume/${firstRecordId}/profile` : "/resumes";
  const viewTarget = firstRecordId ? `/resume/${firstRecordId}/view` : "/resumes";

  const quickActions: QuickAction[] = useMemo(() => [
    {
      key: "builder",
      title: "Resume builder",
      description: "Update personal information and section details for any staff member.",
      to: builderTarget,
      action: "Open builder",
      icon: IconBooks,
    },
    {
      key: "search",
      title: "Search resumes",
      description: "Find profiles by department, training, experience, or awards.",
      to: "/resume/search",
      action: "Go to search",
      icon: IconSearch,
    },
    {
      key: "view",
      title: "Printable view",
      description: "Generate a formatted resume packet to download or print.",
      to: viewTarget,
      action: "View template",
      icon: IconEye,
    },
  ], [builderTarget, viewTarget]);

  const recentRecords = useMemo(() => records.slice(0, 5), [records]);

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">Talent suite</div>
              <h2 className="page-title">Resumes workspace</h2>
              <div className="text-muted mt-1">
                Manage resume data, run searches, and create recruiter-ready documents.
              </div>
            </div>
            <div className="col-auto">
              <div className="btn-list">
                <Link to={builderTarget} className="text-decoration-none">
                  <Button color="primary">
                    <IconBooks size={16} className="me-1" />
                    Launch builder
                  </Button>
                </Link>
                <Link to="/resume/search" className="text-decoration-none">
                  <Button variant="light">
                    <IconSearch size={16} className="me-1" />
                    Advanced search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            <div className="col-12">
              <QuickActionCards actions={quickActions} />
            </div>

            <div className="col-12 col-xl-7">
              <RecentResumesList
                records={recentRecords}
                loading={loading}
                error={error}
                onRetry={reload}
              />
            </div>

            <div className="col-12 col-xl-5">
              <ResumeStatsCard stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeHomePage;
