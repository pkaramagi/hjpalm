import { useCallback, useEffect, useMemo, useState } from "react";
import type { ResumeRecord } from "../types/resume";
import { fetchResumeRecord, type ResumeSectionKey, type ResumeSectionPayloadMap } from "../api/resumeApi";

type Status = "idle" | "loading" | "ready" | "error";

const defaultRecordId: string | undefined = undefined;

const sectionMap: Record<ResumeSectionKey, keyof ResumeRecord> = {
  profile: 'profile',
  education: 'education',
  training: 'training',
  qualifications: 'qualifications',
  family: 'family',
  experience: 'workExperience',
  church: 'churchAppointments',
  awards: 'awards',
  discipline: 'discipline',
  remarks: 'specialRemarks',
};

const missingRecordError = new Error("Resume record is not available");

export interface UseResumeRecordOptions {
  recordId?: string;
  loadOnMount?: boolean;
}

export const useResumeRecord = ({ recordId = defaultRecordId, loadOnMount = true }: UseResumeRecordOptions = {}) => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [record, setRecord] = useState<ResumeRecord | null>(null);
  const [resolvedRecordId, setResolvedRecordId] = useState<string | null>(recordId ?? null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchResumeRecord(recordId);
      const { recordId: nextRecordId, ...rest } = data;
      setRecord(rest);
      setResolvedRecordId(nextRecordId);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load resume"));
      setStatus("error");
    }
  }, [recordId]);

  useEffect(() => {
    if (loadOnMount) {
      void load();
    }
  }, [load, loadOnMount]);

  const updateSection = useCallback(
    async <Section extends ResumeSectionKey>(section: Section, payload: ResumeSectionPayloadMap[Section]) => {
      if (!resolvedRecordId) {
        throw missingRecordError;
      }
      setRecord((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          [sectionMap[section]]: payload,
        };
      });
      return payload;
    },
    [resolvedRecordId],
  );

  const state = useMemo(() => {
    const hasRecord = Boolean(record);
    const isLoading = status === "loading" && !hasRecord;
    const isReady = hasRecord && status !== "error";

    return {
      record,
      recordId: resolvedRecordId,
      isLoading,
      isReady,
      error,
      reload: load,
      updateSection,
    };
  }, [error, load, record, resolvedRecordId, status, updateSection]);

  return state;
};


