import React from "react";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/feedback";

export const Docs: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="API reference"
        description="Exact contract implemented by server/src/modules/video and server/src/workers."
      />

      <div className="grid gap-6">
        <Card className="p-4">
          <h2 className="font-medium text-slate-900">Submit a job</h2>
          <p className="text-sm font-mono text-slate-700 mt-2">POST /api/video/upload-video</p>
          <p className="text-sm text-slate-600 mt-1">Multipart form. The file field is required.</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-3 font-medium">Field</th>
                  <th className="py-2 pr-3 font-medium">Type</th>
                  <th className="py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-3 font-mono">video</td>
                  <td className="py-2 pr-3">file</td>
                  <td className="py-2 text-slate-600">Required. Multer single file.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-mono">options</td>
                  <td className="py-2 pr-3">JSON array string</td>
                  <td className="py-2 text-slate-600">Subset of resize, trim, convert, extract_audio, watermark.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-mono">resolution</td>
                  <td className="py-2 pr-3">string</td>
                  <td className="py-2 text-slate-600">Used by resize. Default 640x360.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-mono">trimStart</td>
                  <td className="py-2 pr-3">number</td>
                  <td className="py-2 text-slate-600">Default 0.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-mono">trimDuration</td>
                  <td className="py-2 pr-3">number</td>
                  <td className="py-2 text-slate-600">Default 5. Used by trim.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-mono">convertFormat</td>
                  <td className="py-2 pr-3">string</td>
                  <td className="py-2 text-slate-600">Used by convert. Default webm.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-mono">watermarkText</td>
                  <td className="py-2 pr-3">string</td>
                  <td className="py-2 text-slate-600">Used by watermark. Centered overlay.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded-md p-3 overflow-x-auto">{`{
  "status": "success",
  "message": "Video upload success. Job queued.",
  "data": { "jobId": "3", "optionsSelected": ["resize", "convert"] }
}`}</pre>
          <pre className="mt-2 bg-slate-100 text-slate-800 text-xs rounded-md p-3 overflow-x-auto">{`curl -X POST http://localhost:3001/api/video/upload-video \\
  -F "video=@input.mp4" \\
  -F 'options=["resize","convert"]' \\
  -F "resolution=1280x720" \\
  -F "convertFormat=mp4"`}</pre>
        </Card>

        <Card className="p-4">
          <h2 className="font-medium text-slate-900">Track progress</h2>
          <p className="text-sm text-slate-600 mt-1">
            Connect with Socket.IO and listen for <span className="font-mono">job_update</span>. The server
            emits processing, completed with download URLs, and failed states. There is no percentage
            progress and no job listing endpoint.
          </p>
          <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded-md p-3 overflow-x-auto">{`{
  "jobId": "3",
  "status": "completed",
  "downloadUrls": ["http://localhost:3001/downloads/jobid-3-converted.mp4"]
}`}</pre>
        </Card>

        <Card className="p-4">
          <h2 className="font-medium text-slate-900">Outputs</h2>
          <ul className="text-sm text-slate-600 mt-2 grid gap-1 list-disc pl-5">
            <li>resize produces jobid-&lt;id&gt;-resized.mp4</li>
            <li>trim produces jobid-&lt;id&gt;-trimmed.mp4</li>
            <li>convert produces jobid-&lt;id&gt;-converted.&lt;format&gt;</li>
            <li>extract_audio produces jobid-&lt;id&gt;-audio.mp3</li>
            <li>watermark produces jobid-&lt;id&gt;-watermarked.mp4</li>
          </ul>
          <p className="text-sm text-slate-600 mt-2">Files are served from /downloads. The source upload is deleted after the job finishes.</p>
        </Card>

        <Card className="p-4">
          <h2 className="font-medium text-slate-900">Errors</h2>
          <p className="text-sm text-slate-600 mt-1">Failures use a shared envelope with a human readable message.</p>
          <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded-md p-3 overflow-x-auto">{`{
  "status": "error",
  "statusCode": 400,
  "message": "No video file uploaded"
}`}</pre>
        </Card>
      </div>
    </div>
  );
};
