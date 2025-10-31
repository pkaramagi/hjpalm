import { useCallback, useEffect, useMemo, useState } from "react";
import type { ResumeRecord } from "../types/resume";
import { fetchResumeRecord, updateResumeRecord, type ResumeSectionKey, type ResumeSectionPayloadMap } from "../api/resumeApi";

type Status = "idle" | "loading" | "ready" | "error";

const defaultRecordId = "default";

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

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchResumeRecord(recordId);
      setRecord(data);
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
      if (!recordId) {
        throw missingRecordError;
      }
      const patched = await updateResumeRecord(recordId, { [sectionMap[section]]: payload } as Partial<ResumeRecord>);

      setRecord(patched);
      return patched[sectionMap[section]] as ResumeSectionPayloadMap[Section];
    },
    [recordId],
  );

  const saveAll = useCallback(
    async (payload: ResumeRecord) => {
      if (!recordId) {
        throw missingRecordError;
      }
      const patched = await updateResumeRecord(recordId, payload);
      setRecord(patched);
      return patched;
    },
    [recordId],
  );

  const state = useMemo(
    () => ({
      record,
      isLoading: status === "loading",
      isReady: status === "ready" && !!record,
      error,
      reload: load,
      updateSection,
      saveAll,
    }),
    [error, load, record, saveAll, status, updateSection],
  );

  return state;
};


