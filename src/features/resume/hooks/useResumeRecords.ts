import { useCallback, useEffect, useState } from "react";

import {
  listResumeRecords,
  type ResumeRecordWithId,
} from "@/features/resume/api/resumeApi";

interface UseResumeRecordsResult {
  records: ResumeRecordWithId[];
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

export function useResumeRecords(): UseResumeRecordsResult {
  const [records, setRecords] = useState<ResumeRecordWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    listResumeRecords()
      .then(setRecords)
      .catch((err) =>
        setError(
          err instanceof Error ? err : new Error("Failed to load resumes"),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { records, loading, error, reload: load };
}
