import React, { useCallback, useEffect, useMemo, useState } from "react";
import { jobSocket } from "../../lib/socket";
import type { TrackedJob } from "./types";
import { JobsContext } from "./jobsContext";

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<TrackedJob[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    jobSocket.start();
    const offStatus = jobSocket.onStatus(setConnected);
    const offUpdate = jobSocket.onUpdate((event) => {
      setJobs((current) =>
        current.map((job) => {
          if (job.jobId !== event.jobId) return job;
          if (event.status === "completed") {
            return { ...job, status: "completed", downloadUrls: event.downloadUrls };
          }
          if (event.status === "failed") {
            return { ...job, status: "failed", error: event.error || "Processing failed." };
          }
          return { ...job, status: "processing" };
        })
      );
    });
    return () => {
      offStatus();
      offUpdate();
    };
  }, []);

  const addJob = useCallback((job: TrackedJob) => {
    setJobs((current) => [job, ...current]);
  }, []);

  const value = useMemo(() => ({ jobs, connected, addJob }), [jobs, connected, addJob]);

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};
