/* eslint-disable react-refresh/only-export-components */
import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";
import type { ResumeRecord } from "../types/resume";
import { useResumeRecord } from "../hooks/useResumeRecord";
import type { ResumeSectionKey, ResumeSectionPayloadMap } from "../api/resumeApi";

interface ResumeContextValue {
  record: ResumeRecord | null;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
  reload: () => void;
  updateSection: <Section extends ResumeSectionKey>(section: Section, payload: ResumeSectionPayloadMap[Section]) => Promise<ResumeSectionPayloadMap[Section]>;
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined);

export function ResumeProvider({ children }: PropsWithChildren) {
  const { record, isLoading, isReady, error, reload, updateSection } = useResumeRecord();

  const value = useMemo(
    () => ({
      record,
      isLoading,
      isReady,
      error,
      reload,
      updateSection,
    }),
    [record, isLoading, isReady, error, reload, updateSection],
  );

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};


