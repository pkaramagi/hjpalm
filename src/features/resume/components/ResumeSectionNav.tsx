import type { ComponentType } from "react";
import { Card } from "tabler-react-ui";
import { Link } from "react-router-dom";
import {
  IconAward,
  IconBook2,
  IconBriefcase,
  IconBuildingChurch,
  IconCertificate,
  IconGavel,
  IconIdBadge2,
  IconMessageDots,
  IconUsersGroup,
} from "@tabler/icons-react";
import { SECTION_ACCENT_COLOR } from "./SectionCard";
import { SECTION_SEQUENCE, resolveSectionPath, type SectionKey } from "../constants/sections";

interface ResumeSectionNavProps {
  currentSection: SectionKey;
  basePath?: string;
}

type IconType = ComponentType<{ size?: number; className?: string; }>;

const SECTION_ICON_MAP: Record<SectionKey, IconType> = {
  profile: IconIdBadge2,
  education: IconBook2,
  training: IconCertificate,
  qualifications: IconAward,
  family: IconUsersGroup,
  experience: IconBriefcase,
  church: IconBuildingChurch,
  awards: IconAward,
  discipline: IconGavel,
  remarks: IconMessageDots,
};

export function ResumeSectionNav({ currentSection, basePath = "/resume" }: ResumeSectionNavProps) {
  return (
    <Card className="my-4">
      <Card.Body className="d-flex flex-wrap gap-1 py-4">
        {SECTION_SEQUENCE.map((section) => {
          const isActive = section.key === currentSection;
          const Icon = SECTION_ICON_MAP[section.key];
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
              <span className="d-inline-flex align-items-center gap-2">
                <Icon size={16} className={isActive ? "text-white" : "text-primary"} />
                <span>{section.label}</span>
              </span>
            </Link>
          );
        })}
      </Card.Body>
    </Card>
  );
}
