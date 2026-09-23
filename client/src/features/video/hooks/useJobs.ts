import { useContext } from "react";
import { JobsContext, type JobsContextValue } from "../jobsContext";

export function useJobs(): JobsContextValue {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be used inside JobsProvider");
  return context;
}
