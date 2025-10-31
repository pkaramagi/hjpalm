import { Card } from "tabler-react-ui";
import { Link } from "react-router-dom";
import { SECTION_ACCENT_COLOR } from "./SectionCard";
import { SECTION_SEQUENCE, resolveSectionPath, type SectionKey } from "../constants/sections";

interface ResumeSectionNavProps {
  currentSection: SectionKey;
  basePath?: string;
}

export function ResumeSectionNav({ currentSection, basePath = "/resume" }: ResumeSectionNavProps) {
  return (
    <Card className="mb-4">
      <Card.Body className="d-flex flex-wrap gap-2">
        {SECTION_SEQUENCE.map((section) => {
          const isActive = section.key === currentSection;
          return (
            <Link
              key={section.key}
              to={resolveSectionPath(section.key, basePath)}
              className={`btn btn-outline-primary btn-sm ${isActive ? "text-white" : ""}`}
              style={
                isActive
                  ? { backgroundColor: SECTION_ACCENT_COLOR, borderColor: SECTION_ACCENT_COLOR }
                  : undefined
              }
            >
              {section.label}
            </Link>
          );
        })}
      </Card.Body>
    </Card>
  );
}
