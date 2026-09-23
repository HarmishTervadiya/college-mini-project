import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input, Field } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Alert, PageHeader } from "../components/ui/feedback";
import { useSubmitVideo } from "../features/video/hooks/useSubmitVideo";
import { useJobs } from "../features/video/hooks/useJobs";
import {
  CONVERT_FORMATS,
  DEFAULTS,
  OPERATIONS,
  RESOLUTIONS,
} from "../features/video/constants";
import type { UploadVideoInput, VideoOperation } from "../features/video/types";
import { formatBytes } from "../utils/formatters";

export const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const { pending, error, submit } = useSubmitVideo();
  const { addJob } = useJobs();

  const [file, setFile] = useState<File | null>(null);
  const [operations, setOperations] = useState<VideoOperation[]>(["resize", "convert"]);
  const [resolution, setResolution] = useState(DEFAULTS.resolution);
  const [trimStart, setTrimStart] = useState(String(DEFAULTS.trimStart));
  const [trimDuration, setTrimDuration] = useState(String(DEFAULTS.trimDuration));
  const [convertFormat, setConvertFormat] = useState(DEFAULTS.convertFormat);
  const [watermarkText, setWatermarkText] = useState(DEFAULTS.watermarkText);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleOperation = (operation: VideoOperation) => {
    setOperations((current) =>
      current.includes(operation)
        ? current.filter((item) => item !== operation)
        : [...current, operation]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!file) {
      setFormError("Choose a video file first.");
      return;
    }
    if (operations.length === 0) {
      setFormError("Select at least one operation.");
      return;
    }

    const parsedTrimStart = Number(trimStart);
    const parsedTrimDuration = Number(trimDuration);
    if (operations.includes("trim") && (!Number.isFinite(parsedTrimStart) || parsedTrimStart < 0)) {
      setFormError("Start time must be zero or more.");
      return;
    }
    if (
      operations.includes("trim") &&
      (!Number.isFinite(parsedTrimDuration) || parsedTrimDuration <= 0)
    ) {
      setFormError("Duration must be greater than zero.");
      return;
    }

    const input: UploadVideoInput = {
      file,
      operations,
      resolution,
      trimStart: Number.isFinite(parsedTrimStart) ? parsedTrimStart : DEFAULTS.trimStart,
      trimDuration: Number.isFinite(parsedTrimDuration) ? parsedTrimDuration : DEFAULTS.trimDuration,
      convertFormat,
      watermarkText: watermarkText.trim().length > 0 ? watermarkText : DEFAULTS.watermarkText,
    };

    const job = await submit(input);
    if (job) {
      addJob(job);
      navigate(`/dashboard?jobId=${encodeURIComponent(job.jobId)}`);
    }
  };

  return (
    <div>
      <PageHeader
        title="New processing job"
        description="One file, one request. Each selected operation produces its own output file."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6">
          <Card className="p-4">
            <Field label="Video file" hint={file ? formatBytes(file.size) : "MP4, MKV, MOV, WebM, or AVI."}>
              <Input
                type="file"
                accept="video/*,.mkv,.mov,.webm,.avi"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </Field>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-medium text-slate-900 mb-3">Operations</h2>
            <div className="grid gap-2">
              {OPERATIONS.map((item) => (
                <label
                  key={item.value}
                  className="flex items-start gap-3 border border-slate-200 rounded-md px-3 py-2"
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={operations.includes(item.value)}
                    onChange={() => toggleOperation(item.value)}
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-900">{item.label}</span>
                    <span className="block text-sm text-slate-600">{item.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-4 grid gap-4 sm:grid-cols-2">
            {operations.includes("resize") && (
              <Field label="Resolution">
                <Select
                  value={resolution}
                  onChange={(event) => setResolution(event.target.value)}
                  options={RESOLUTIONS.map((value) => ({ value, label: value }))}
                />
              </Field>
            )}
            {operations.includes("trim") && (
              <>
                <Field label="Start time (seconds)">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={trimStart}
                    onChange={(event) => setTrimStart(event.target.value)}
                  />
                </Field>
                <Field label="Duration (seconds)">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={trimDuration}
                    onChange={(event) => setTrimDuration(event.target.value)}
                  />
                </Field>
              </>
            )}
            {operations.includes("convert") && (
              <Field label="Convert format">
                <Select
                  value={convertFormat}
                  onChange={(event) => setConvertFormat(event.target.value)}
                  options={CONVERT_FORMATS.map((value) => ({ value, label: value }))}
                />
              </Field>
            )}
            {operations.includes("watermark") && (
              <Field label="Watermark text">
                <Input
                  value={watermarkText}
                  onChange={(event) => setWatermarkText(event.target.value)}
                  placeholder={DEFAULTS.watermarkText}
                />
              </Field>
            )}
            {!operations.includes("resize") &&
              !operations.includes("trim") &&
              !operations.includes("convert") &&
              !operations.includes("watermark") && (
                <p className="text-sm text-slate-600 sm:col-span-2">
                  Extract audio needs no extra settings.
                </p>
              )}
          </Card>
        </div>

        <div>
          <Card className="p-4 lg:sticky lg:top-4">
            <h2 className="text-sm font-medium text-slate-900">Summary</h2>
            <dl className="text-sm mt-3 grid gap-2">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">File</dt>
                <dd className="text-slate-900 truncate">{file ? file.name : "Not selected"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Operations</dt>
                <dd className="text-slate-900">{operations.length > 0 ? operations.join(", ") : "None"}</dd>
              </div>
            </dl>
            {(formError || error) && (
              <div className="mt-3">
                <Alert>{formError || error}</Alert>
              </div>
            )}
            <Button type="submit" loading={pending} className="w-full mt-4">
              Upload and process
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

