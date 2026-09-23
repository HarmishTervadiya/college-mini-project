import { useCallback, useState } from "react";
import { submitVideoJob } from "../api";
import { getErrorMessage } from "../../../lib/api/errors";
import type { TrackedJob, UploadVideoInput } from "../types";

interface SubmitState {
  pending: boolean;
  error: string | null;
  createdJob: TrackedJob | null;
}

export function useSubmitVideo() {
  const [state, setState] = useState<SubmitState>({
    pending: false,
    error: null,
    createdJob: null,
  });

  const submit = useCallback(async (input: UploadVideoInput) => {
    setState({ pending: true, error: null, createdJob: null });
    try {
      const created = await submitVideoJob(input);
      const job: TrackedJob = {
        jobId: created.jobId,
        filename: input.file.name,
        operations: created.operations,
        status: "queued",
        downloadUrls: [],
        createdAt: new Date().toISOString(),
      };
      setState({ pending: false, error: null, createdJob: job });
      return job;
    } catch (error) {
      setState({ pending: false, error: getErrorMessage(error), createdJob: null });
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    setState({ pending: false, error: null, createdJob: null });
  }, []);

  return { ...state, submit, clear };
}
