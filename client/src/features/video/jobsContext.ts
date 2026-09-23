import { createContext } from "react";
import type { TrackedJob } from "./types";

export interface JobsContextValue {
  jobs: TrackedJob[];
  connected: boolean;
  addJob: (job: TrackedJob) => void;
}

export const JobsContext = createContext<JobsContextValue | null>(null);
