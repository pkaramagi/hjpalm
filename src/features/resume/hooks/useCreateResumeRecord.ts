import { useMutation } from "@tanstack/react-query";

import { createResumeRecord, type ResumeCreateInput, type ResumeRecordWithId } from "../api/resumeApi";

export function useCreateResumeRecord() {
  return useMutation<ResumeRecordWithId, Error, ResumeCreateInput>({
    mutationFn: async (payload) => {
      const record = await createResumeRecord(payload);
      return record;
    },
  });
}

