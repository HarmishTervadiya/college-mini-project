import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Progress } from "../components/ui/Progress";
import { Modal } from "../components/ui/Modal";
import { Tabs } from "../components/ui/Tabs";
import { formatBytes, formatDate } from "../utils/formatters";
import { VideoJob } from "../utils/mock-data";
import { videoApi } from "../lib/axios";
import { socketService } from "../lib/socket";
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  Terminal, 
  Download, 
  RotateCw, 
  Eye, 
  HardDrive,
  Trash2,
  Plus
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [clusterMetrics, setClusterMetrics] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedJobForLogs, setSelectedJobForLogs] = useState<VideoJob | null>(null);
  const [selectedJobForPreview, setSelectedJobForPreview] = useState<VideoJob | null>(null);
  const [selectedJobForMeta, setSelectedJobForMeta] = useState<VideoJob | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("connected");

  useEffect(() => {
    const fetchInitialData = async () => {
      const jobList = await videoApi.listJobs();
      setJobs(jobList);
      const metrics = await videoApi.getClusterMetrics();
      setClusterMetrics(metrics);
    };

    fetchInitialData();

    const unsubStatus = socketService.on("connection_status", (data) => {
      setConnectionStatus(data.status);
    });

    const unsubProgress = socketService.on("job:progress", (data) => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.id === data.jobId) {
            const updatedLogs = data.log ? [...job.logs, data.log] : job.logs;
            return {
              ...job,
              progress: data.progress,
              fps: data.fps,
              speed: data.speed,
              status: "processing",
              logs: updatedLogs
            };
          }
          return job;
        })
      );
    });

    const unsubCompleted = socketService.on("job:completed", (data) => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.id === data.jobId) {
            const updatedLogs = data.log ? [...job.logs, data.log] : job.logs;
            return {
              ...job,
              status: "completed",
              progress: 100,
              outputUrl: data.outputUrl,
              completedAt: data.completedAt,
              outputSize: data.outputSize,
              logs: updatedLogs
            };
          }
          return job;
        })
      );
    });

    return () => {
      unsubStatus();
      unsubProgress();
      unsubCompleted();
    };
  }, []);

  const handleCancel = async (jobId: string) => {
    socketService.cancelSimulation(jobId);
    await videoApi.cancelJob(jobId);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "failed" } : j))
    );
  };

  const handleRetry = async (job: VideoJob) => {
    await videoApi.retryJob(job.id);
    const updatedJob: VideoJob = {
      ...job,
      status: "processing",
      progress: 5,
      logs: [...job.logs, `[retry] Job re-dispatched at ${new Date().toISOString()}`]
    };
    setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));
    socketService.simulateJobProgress(updatedJob);
  };

  const filteredJobs = jobs.filter((j) => {
    if (activeFilter === "all") return true;
    return j.status === activeFilter;
  });

  const getStatusBadge = (status: VideoJob["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="success"><CheckCircle className="w-3 h-3" /> Completed</Badge>;
      case "processing":
        return <Badge variant="info"><Activity className="w-3 h-3 animate-spin" /> Processing</Badge>;
      case "queued":
        return <Badge variant="warning"><Clock className="w-3 h-3" /> Queued</Badge>;
      case "failed":
        return <Badge variant="error">Failed</Badge>;
    }
  };

  const counts = {
    all: jobs.length,
    processing: jobs.filter((j) => j.status === "processing").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    queued: jobs.filter((j) => j.status === "queued").length,
    failed: jobs.filter((j) => j.status === "failed").length
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Distributed Transcoding Cluster Dashboard"
        description="Monitor real-time FFmpeg worker processes, frame telemetry, queue latencies, and output artifacts via Socket.IO."
        badge={
          <Badge variant="outline" size="sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
            Socket.IO: {connectionStatus === "connected" ? "Live Stream" : "Telemetry Active"}
          </Badge>
        }
        actions={
          <Link to="/workspace">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5" />
              New Transcode Job
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-surface-900/50">
          <div className="text-[11px] font-mono text-surface-500 uppercase tracking-wider">Active Workers</div>
          <div className="text-2xl font-bold text-white mt-1">8 / 8 Nodes</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>Cluster Healthy</span>
          </div>
        </Card>

        <Card className="p-4 bg-surface-900/50">
          <div className="text-[11px] font-mono text-surface-500 uppercase tracking-wider">Current Throughput</div>
          <div className="text-2xl font-bold text-white mt-1">
            {clusterMetrics?.throughputMbps || 485.6} Mbps
          </div>
          <div className="text-xs text-surface-400 mt-1 font-mono">
            Hardware: NVENC / AV1
          </div>
        </Card>

        <Card className="p-4 bg-surface-900/50">
          <div className="text-[11px] font-mono text-surface-500 uppercase tracking-wider">Active Queue</div>
          <div className="text-2xl font-bold text-white mt-1">
            {counts.processing + counts.queued} In Flight
          </div>
          <div className="text-xs text-surface-400 mt-1 font-mono">
            {counts.processing} encoding, {counts.queued} queued
          </div>
        </Card>

        <Card className="p-4 bg-surface-900/50">
          <div className="text-[11px] font-mono text-surface-500 uppercase tracking-wider">Completed Today</div>
          <div className="text-2xl font-bold text-white mt-1">
            {clusterMetrics?.processedToday || 142} Jobs
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-mono">
            100% Success Rate
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-800 pb-2">
          <Tabs
            tabs={[
              { id: "all", label: "All Jobs", count: counts.all },
              { id: "processing", label: "Processing", count: counts.processing },
              { id: "completed", label: "Completed", count: counts.completed },
              { id: "queued", label: "Queued", count: counts.queued },
              { id: "failed", label: "Failed", count: counts.failed }
            ]}
            activeTab={activeFilter}
            onChange={(tabId) => setActiveFilter(tabId)}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center mx-auto text-surface-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">No jobs found in this view</h3>
              <p className="text-xs text-surface-400">
                Launch a transcoding process from the studio to track real-time progress.
              </p>
            </div>
            <Link to="/workspace">
              <Button size="sm">Open Studio</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              return (
                <Card key={job.id} className="p-5 space-y-4 hover:border-surface-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-sm text-white">{job.filename}</span>
                        {getStatusBadge(job.status)}
                        <Badge variant="outline" size="sm">{job.container.toUpperCase()}</Badge>
                        <Badge variant="outline" size="sm">{job.videoCodec}</Badge>
                        <Badge variant="outline" size="sm">{job.resolution}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-surface-400">
                        <span>ID: {job.id}</span>
                        <span>-</span>
                        <span>Size: {formatBytes(job.originalSize)}</span>
                        <span>-</span>
                        <span>Created: {formatDate(job.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedJobForLogs(job)}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        Logs
                      </Button>

                      {job.status === "completed" && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedJobForPreview(job)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </Button>
                          <a
                            href={job.outputUrl || "#"}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm">
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </Button>
                          </a>
                        </>
                      )}

                      {job.status === "processing" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(job.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Cancel
                        </Button>
                      )}

                      {job.status === "failed" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRetry(job)}
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          Retry
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedJobForMeta(job)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>

                  {job.status === "processing" && (
                    <div className="space-y-2 pt-2 border-t border-surface-800/60">
                      <div className="flex justify-between items-center text-xs font-mono text-surface-300">
                        <div className="flex items-center gap-4">
                          <span>Progress: {job.progress.toFixed(1)}%</span>
                          {job.fps && <span className="text-emerald-400">FPS: {job.fps}</span>}
                          {job.speed && <span className="text-surface-400">Speed: {job.speed}</span>}
                          {job.eta && <span className="text-surface-400">ETA: {job.eta}</span>}
                        </div>
                      </div>
                      <Progress value={job.progress} size="md" />
                    </div>
                  )}

                  {job.status === "completed" && job.outputSize && (
                    <div className="pt-2 border-t border-surface-800/60 flex items-center justify-between text-xs font-mono text-surface-400">
                      <div>
                        Compressed size: <span className="text-white">{formatBytes(job.outputSize)}</span>
                        <span className="text-emerald-400 ml-2">
                          ({Math.round(((job.originalSize - job.outputSize) / job.originalSize) * 100)}% space saved)
                        </span>
                      </div>
                      <div className="text-[11px] text-surface-500">
                        Completed at: {job.completedAt ? formatDate(job.completedAt) : "Recently"}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {selectedJobForLogs && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJobForLogs(null)}
          title={`FFmpeg Stderr Telemetry Log: ${selectedJobForLogs.id}`}
          description={`Real-time stdout/stderr stream from transcode worker node`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-4 bg-surface-950 rounded-xl border border-surface-800 font-mono text-xs text-surface-300 space-y-1.5 max-h-96 overflow-y-auto">
              {selectedJobForLogs.logs && selectedJobForLogs.logs.length > 0 ? (
                selectedJobForLogs.logs.map((line, idx) => (
                  <div key={idx} className="leading-relaxed hover:text-white transition-colors">
                    <span className="text-surface-600 mr-2">{String(idx + 1).padStart(3, "0")}</span>
                    <span>{line}</span>
                  </div>
                ))
              ) : (
                <div className="text-surface-500">No log output available yet.</div>
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-surface-500">
              <span>Auto-refreshing via WebSocket feed</span>
              <Button size="sm" variant="outline" onClick={() => setSelectedJobForLogs(null)}>
                Close Viewer
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedJobForPreview && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJobForPreview(null)}
          title={`Artifact Playback: ${selectedJobForPreview.filename}`}
          description={`Transcoded output rendered with faststart moov atom header`}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-black aspect-video border border-surface-800">
              <video
                src={selectedJobForPreview.outputUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-surface-400">
                Format: {selectedJobForPreview.container.toUpperCase()} | Codec: {selectedJobForPreview.videoCodec}
              </span>
              <Button size="sm" onClick={() => setSelectedJobForPreview(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedJobForMeta && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJobForMeta(null)}
          title={`Job Specification: ${selectedJobForMeta.id}`}
          description="Detailed execution metadata and command options"
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="bg-surface-950 p-4 rounded-xl border border-surface-800 space-y-2">
              <div className="text-surface-500">// FFmpeg Command</div>
              <div className="text-surface-200 break-all">{selectedJobForMeta.command}</div>
            </div>
            <div className="bg-surface-950 p-4 rounded-xl border border-surface-800 space-y-2">
              <div className="text-surface-500">// Raw Job Schema Object</div>
              <pre className="text-surface-300 overflow-x-auto text-[11px]">
                {JSON.stringify(selectedJobForMeta, null, 2)}
              </pre>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setSelectedJobForMeta(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
