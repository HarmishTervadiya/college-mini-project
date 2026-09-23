import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/feedback";

const OPERATION_SUMMARY = [
  { name: "Resize", detail: "Scale the video to 640x360, 854x480, 1280x720, or 1920x1080." },
  { name: "Trim", detail: "Cut a section using start time and duration in seconds." },
  { name: "Convert", detail: "Change the container to mp4, webm, avi, mov, or mkv." },
  { name: "Extract audio", detail: "Save the audio track as an MP3 file." },
  { name: "Watermark", detail: "Add centered text over the video." },
];

export const Landing: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Process videos with FFmpeg jobs"
        description="Upload a file, choose operations, and download each result when the worker finishes."
        action={
          <Link to="/workspace">
            <Button>Start a job</Button>
          </Link>
        }
      />

      <section aria-label="How it works" className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="p-4">
          <h2 className="font-medium text-slate-900">1. Upload</h2>
          <p className="text-sm text-slate-600 mt-1">Send one video file with the operations you need.</p>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium text-slate-900">2. Queue</h2>
          <p className="text-sm text-slate-600 mt-1">The server queues a BullMQ job and returns a job ID.</p>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium text-slate-900">3. Download</h2>
          <p className="text-sm text-slate-600 mt-1">Listen for completion and download files from /downloads.</p>
        </Card>
      </section>

      <section aria-label="Supported operations">
        <h2 className="text-base font-semibold text-slate-900 mb-3">Supported operations</h2>
        <Card>
          <ul className="divide-y divide-slate-200">
            {OPERATION_SUMMARY.map((item) => (
              <li key={item.name} className="px-4 py-3 flex flex-col sm:flex-row sm:gap-4">
                <span className="text-sm font-medium text-slate-900 w-32 shrink-0">{item.name}</span>
                <span className="text-sm text-slate-600">{item.detail}</span>
              </li>
            ))}
          </ul>
        </Card>
        <div className="mt-4 flex gap-2">
          <Link to="/dashboard">
            <Button variant="secondary">View jobs</Button>
          </Link>
          <Link to="/docs">
            <Button variant="ghost">Read the API docs</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
