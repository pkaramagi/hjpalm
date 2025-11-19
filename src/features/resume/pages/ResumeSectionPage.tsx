import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Card, Loader, Page, Pagination, Text } from "tabler-react-ui";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useResume } from "../components/ResumeContext";
import { ResumeSectionNav } from "../components/ResumeSectionNav";
import {
  SECTION_SEQUENCE,
  mapPathToSection,
  resolveSectionPath,
  type SectionKey,
} from "../constants/sections";
import {
  AwardsSection,
  ChurchSection,
  DisciplineSection,
  EducationSection,
  ExperienceSection,
  FamilySection,
  ProfileSection,
  QualificationsSection,
  RemarksSection,
  TrainingSection,
} from "../components/sections";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type SectionRenderer = (props: { footer?: ReactNode; }) => JSX.Element;

const sectionComponentMap: Record<SectionKey, SectionRenderer> = {
  profile: ProfileSection,
  education: EducationSection,
  training: TrainingSection,
  qualifications: QualificationsSection,
  family: FamilySection,
  experience: ExperienceSection,
  church: ChurchSection,
  awards: AwardsSection,
  discipline: DisciplineSection,
  remarks: RemarksSection,
};

export function ResumeSectionPage() {
  const navigate = useNavigate();
  const { resumeId, sectionPath } = useParams<{ resumeId?: string; sectionPath?: string; }>();
  const sectionKey = mapPathToSection(sectionPath);
  const basePath = resumeId ? `/resume/${resumeId}` : null;
  const { isLoading, isReady, error, reload } = useResume();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!basePath) {
    return <Navigate to="/resumes" replace />;
  }

  useEffect(() => {
    if (!saveStatus) {
      return;
    }
    const timeout = window.setTimeout(() => setSaveStatus(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [saveStatus]);

  if (!sectionKey) {
    return <Navigate to={resolveSectionPath("profile", basePath)} replace />;
  }

  if (isLoading && !isReady) {
    return (
      <div className="container-xl py-6 d-flex justify-content-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl py-4">
        <Card className="card card-md">
          <Card.Body>
            <Alert type="danger" className="mb-3">
              {error.message}
            </Alert>
            <Button color="primary" onClick={reload}>
              Try again
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }



  const currentIndex = SECTION_SEQUENCE.findIndex((section) => section.key === sectionKey);
  if (currentIndex === -1) {
    return <Navigate to={resolveSectionPath("profile", basePath)} replace />;
  }
  const previousSection = currentIndex > 0 ? SECTION_SEQUENCE[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < SECTION_SEQUENCE.length - 1
      ? SECTION_SEQUENCE[currentIndex + 1]
      : null;

  const SectionComponent = sectionComponentMap[sectionKey];
  const totalSections = SECTION_SEQUENCE.length;
  const currentDefinition = SECTION_SEQUENCE[currentIndex];

  const handleSave = () => {
    setSaveStatus("Section saved! Integrate this with your persistence layer.");
  };

  const handleGoPrevious = () => {
    if (!previousSection) {
      return;
    }
    navigate(resolveSectionPath(previousSection.key, basePath));
  };

  const handleGoNext = () => {
    if (nextSection) {
      navigate(resolveSectionPath(nextSection.key, basePath));
    } else {
      handleSave();
    }
  };

  const sectionFooter: ReactNode = (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <Text muted size="sm">
        Save this section to preserve your updates before moving on.
      </Text>
      <div className="d-flex gap-2">
        <Button
          color="secondary"
          ghost
          type="button"
          onClick={() => navigate(resolveSectionPath("profile", basePath))}
        >
          Back to profile
        </Button>
        <Button color="primary" type="button" onClick={handleSave}>
          Save section
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <Page.PreTitle>
                Section {currentIndex + 1} of {totalSections}
              </Page.PreTitle>
              <Page.Title>{currentDefinition.label}</Page.Title>
              <Page.Subtitle>
                Fill out the {currentDefinition.label.toLowerCase()} section of your resume.
              </Page.Subtitle>
            </div>
            <div className="col-auto">
              <div className="btn-list">
                {previousSection ? (
                  <Button
                    color="primary"
                    outline
                    type="button"
                    onClick={() => navigate(resolveSectionPath(previousSection.key, basePath))}
                  >
                    <IconChevronLeft size={18} className="me-2 rotate-180" />
                    Previous Section
                  </Button>
                ) : null}
                {nextSection ? (
                  <Button
                    color="success"
                    outline

                  onClick={() => navigate(resolveSectionPath(nextSection.key, basePath))}
                  >
                    Next section <IconChevronRight size={18} className="ms-2" />
                  </Button>
                ) : (
                  <Button color="primary" type="button" onClick={handleSave}>
                    Save and finish
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="container-xl d-grid gap-3">
          <ResumeSectionNav currentSection={sectionKey} basePath={basePath} />

          {saveStatus ? (
            <Alert type="success" className="mb-0">
              {saveStatus}
            </Alert>
          ) : null}

          <SectionComponent footer={sectionFooter} />

          <Pagination className="pagination-lg justify-content-between">
            <Pagination.Item className="page-prev" disabled={!previousSection}>
              <Pagination.Link
                href={
                  previousSection
                    ? resolveSectionPath(previousSection.key, basePath)
                    : "#"
                }
                onClick={(event) => {
                  event.preventDefault();
                  handleGoPrevious();
                }}
                aria-disabled={!previousSection}
                tabIndex={previousSection ? undefined : -1}
              >
                <div className="row align-items-center">
                  <div className="col-auto">
                    <IconChevronLeft size={18} className="me-2 rotate-180" />
                  </div>
                  <div className="col">
                    <div className="page-item-subtitle">Previous</div>
                    <div className="page-item-title">
                      {previousSection ? previousSection.label : currentDefinition.label}
                    </div>
                  </div></div>

              </Pagination.Link>
            </Pagination.Item>
            <Pagination.Item className="page-next">
              <Pagination.Link
                href={
                  nextSection ? resolveSectionPath(nextSection.key, basePath) : "#"
                }
                onClick={(event) => {
                  event.preventDefault();
                  handleGoNext();
                }}
              >
                <div className="row align-items-center">
                  <div className="col">
                    <div className="page-item-subtitle">{nextSection ? "Next" : "Complete"}</div>
                    <div className="page-item-title">
                      {nextSection ? nextSection.label : "Save & finish"}
                    </div>

                  </div>
                  <div className="col-auto">
                    <IconChevronRight size={18} className="ms-2" />
                  </div>
                </div>
              </Pagination.Link>
            </Pagination.Item>
          </Pagination>
        </div>
      </div>
    </>
  );
}
