import { useMemo } from "react";
import type { WorkExperienceEntry } from "../types/resume";
import type { ResumeRecordWithId } from "../api/resumeApi";
import { formatDisplayName, getInitials, formatPhone, getLatestEntry } from "../utils/formatters";

export interface ResumeTableRow {
  id: string;
  avatar?: string;
  name: string;
  englishName?: string;
  department: string;
  currentRole: string;
  company: string;
  email: string;
  phone: string;
  profileId: string;
  initials: string;
}

/**
 * Custom hook to transform resume records into table row data
 * @param records - Array of resume records
 * @returns Memoized array of table rows
 */
export function useResumeTableData(records: ResumeRecordWithId[]): ResumeTableRow[] {
  return useMemo(() => {
    return records.map((record) => {
      const profile = record.profile ?? {};
      const latestWork = getLatestEntry<WorkExperienceEntry>(record.workExperience);

      const name = formatDisplayName(
        profile.nameKorean,
        profile.firstNameEnglish,
        profile.lastNameEnglish
      );

      return {
        id: record.recordId,
        avatar: profile.photoUrl ?? undefined,
        name,
        englishName: profile.nameHanja?.trim() || undefined,
        department: profile.department?.trim() || "Unassigned",
        currentRole:
          latestWork?.finalPosition?.trim() ||
          profile.positionTitle?.trim() ||
          "-",
        company:
          latestWork?.companyName?.trim() ||
          profile.affiliation?.trim() ||
          "-",
        email: profile.email?.trim() || "-",
        phone: formatPhone(profile.mobilePhone, profile.extensionNumber),
        profileId: record.recordId,
        initials: getInitials(name),
      };
    });
  }, [records]);
}
