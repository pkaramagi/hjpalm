import { useMemo } from "react";
import type { ResumeRecordWithId } from "../api/resumeApi";

export interface ResumeStats {
  total: number;
  withPhoto: number;
  withEmail: number;
  departments: number;
}

/**
 * Custom hook to calculate statistics from resume records
 * @param records - Array of resume records
 * @returns Computed statistics
 */
export function useResumeStats(records: ResumeRecordWithId[]): ResumeStats {
  return useMemo(() => {
    const withPhoto = records.filter(
      (record) => record.profile.photoUrl?.trim()
    ).length;

    const withEmail = records.filter(
      (record) => record.profile.email?.trim()
    ).length;

    const departments = new Set(
      records
        .map((record) => record.profile.department?.trim())
        .filter((dept): dept is string => Boolean(dept && dept.length > 0))
    );

    return {
      total: records.length,
      withPhoto,
      withEmail,
      departments: departments.size,
    };
  }, [records]);
}
