import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Alert, EmptyState, PageHeader } from "../components/ui/feedback";
import { useJobs } from "../features/video/hooks/useJobs";
import type { TrackedJob } from "../features/video/types";
import { formatDate } from "../utils/formatters";

function toneForStatus(status: TrackedJob["status"]) {
  if (status === "completed") return "success" as const;
  if (status === "failed") return "error" as const;
  if (status === "processing") return "info" as const;
  return "neutral" as const;
}

export const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedJobId = searchParams.get("jobId");
  const { jobs, connected } = useJobs();

  useEffect(() => {
    if (highlightedJobId) {
      document.getElementById(`job-${highlightedJobId}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedJobId, jobs.length]);

  return (
    <div>
      <PageHeader
        title="Jobs"
        description={
          connected
            ? "Connected to the server. Status changes arrive over Socket.IO."
            : "Jobs submitted in this session appear here. Reconnecting to the server."
        }
        action={
          <Link to="/workspace">
            <Button variant="secondary">New job</Button>
          </Link>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Submit a video from the workspace. Each completed operation returns its own download link."
          action={
            <Link to="/workspace">
              <Button>Go to workspace</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3">
          {jobs.map((job) => (
            <Card
              key={job.jobId}
              id={`job-${job.jobId}`}
              className={highlightedJobId === job.jobId ? "border-slate-900" : undefined}
            >
              <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-900 truncate">{job.filename}</span>
                    <Badge tone={toneForStatus(job.status)}>{job.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 font-mono">
                    {job.jobId} | {job.operations.join(", ")} | {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4">
                {job.status === "failed" && <Alert>{job.error || "Processing failed."}</Alert>}
                {job.status === "completed" && (
                  <ul className="grid gap-2">
                    {job.downloadUrls.map((url) => (
                      <li key={url} className="text-sm break-all">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline underline-offset-2"
                        >
                          {url.split("/").pop() || url}
                        </a>
                      </li>
                    ))}
                    {job.downloadUrls.length === 0 && (
                      <li className="text-sm text-slate-600">Finished, but no download links were returned.</li>
                    )}
                  </ul>
                )}
                {(job.status === "queued" || job.status === "processing") && (
                  <p className="text-sm text-slate-600">Waiting for worker updates.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

