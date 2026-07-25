import React, { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { 
  BookOpen, 
  Code, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Check, 
  Copy,
  AlertCircle
} from "lucide-react";

export const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySnippet = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems = [
    { id: "overview", label: "Architecture Overview", icon: Layers },
    { id: "codecs", label: "Supported Codecs & Containers", icon: Cpu },
    { id: "rest-api", label: "REST API Reference", icon: Code },
    { id: "websocket", label: "WebSocket Events", icon: Radio },
    { id: "filters", label: "FFmpeg Filtergraph", icon: Terminal },
    { id: "validation", label: "Zod Schema Specs", icon: ShieldCheck },
    { id: "errors", label: "Error Handling & Retries", icon: AlertCircle }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Technical Documentation & API Reference"
        description="Complete developer guide for integrating with the StreamForge distributed transcoding cluster, WebSocket event bus, and FFmpeg filtergraph pipeline."
        badge={
          <Badge variant="outline" size="sm">
            <BookOpen className="w-3 h-3 text-surface-400" />
            API v1.0
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1">
          <div className="sticky top-20 bg-surface-950 p-2 rounded-xl border border-surface-800 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-surface-500 px-3 py-2">
              Documentation Index
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? "bg-surface-800 text-white border border-surface-700 shadow-xs"
                      : "text-surface-400 hover:text-surface-200 hover:bg-surface-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Architecture Overview</h2>
                <p className="text-xs text-surface-400 leading-relaxed">
                  StreamForge is an asynchronous, event-driven video transcoding system designed for high reliability and throughput.
                </p>
              </div>

              <Card className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-surface-200">System Topology</h3>
                <div className="p-4 rounded-lg bg-surface-950 border border-surface-800 font-mono text-xs text-surface-300 leading-relaxed space-y-2">
                  <p className="text-surface-400">// Pipeline Flowchart</p>
                  <p className="text-white">[Client / API Consumer]</p>
                  <p className="text-surface-500">  |--&gt; HTTP Multipart Upload (Chunked Stream)</p>
                  <p className="text-white">[REST Gateway / Express + Zod Validator]</p>
                  <p className="text-surface-500">  |--&gt; Push payload to Redis Job Queue (BullMQ)</p>
                  <p className="text-white">[Worker Pool (FFmpeg 7.0 + NVENC / CPU)]</p>
                  <p className="text-surface-500">  |--&gt; Spawns FFmpeg child process with stderr stream monitoring</p>
                  <p className="text-surface-500">  |--&gt; Emits progress packets to Socket.IO bus (1000ms cadence)</p>
                  <p className="text-white">[Output Packaging + CDN Muxing]</p>
                  <p className="text-surface-500">  |--&gt; Finalizes faststart moov atom and generates download URL</p>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 space-y-2">
                  <div className="font-semibold text-xs text-white">Zero Queue Starvation</div>
                  <p className="text-xs text-surface-400 leading-relaxed">
                    Priority scheduling ensures short clips and real-time previews process without being delayed behind large 4K encodes.
                  </p>
                </Card>
                <Card className="p-4 space-y-2">
                  <div className="font-semibold text-xs text-white">Stream Copy Passthrough</div>
                  <p className="text-xs text-surface-400 leading-relaxed">
                    When container re-packaging is requested without codec transformation, the engine executes direct bitstream remuxing with near-zero latency.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "codecs" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Supported Codecs &amp; Containers</h2>
                <p className="text-xs text-surface-400 leading-relaxed">
                  Specification matrix for video codecs, audio streams, and container formats supported across the cluster.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-surface-800 bg-surface-900/40">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-surface-800 bg-surface-900 text-surface-400 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">Codec ID</th>
                      <th className="p-3">Encoder Library</th>
                      <th className="p-3">Hardware Accel</th>
                      <th className="p-3">Typical Bitrate Range</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800/60 font-mono text-surface-300">
                    <tr>
                      <td className="p-3 font-semibold text-white">H.264 / AVC</td>
                      <td className="p-3">libx264</td>
                      <td className="p-3 text-emerald-400">NVENC / QSV</td>
                      <td className="p-3">1500k - 18000k</td>
                      <td className="p-3"><Badge variant="success" size="sm">Active</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">H.265 / HEVC</td>
                      <td className="p-3">libx265</td>
                      <td className="p-3 text-emerald-400">NVENC / QSV</td>
                      <td className="p-3">800k - 12000k</td>
                      <td className="p-3"><Badge variant="success" size="sm">Active</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">VP9</td>
                      <td className="p-3">libvpx-vp9</td>
                      <td className="p-3 text-surface-500">CPU Threaded</td>
                      <td className="p-3">900k - 10000k</td>
                      <td className="p-3"><Badge variant="success" size="sm">Active</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">AV1</td>
                      <td className="p-3">libsvtav1</td>
                      <td className="p-3 text-surface-500">SVT Optimized</td>
                      <td className="p-3">600k - 8000k</td>
                      <td className="p-3"><Badge variant="success" size="sm">Active</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Opus Audio</td>
                      <td className="p-3">libopus</td>
                      <td className="p-3 text-surface-500">N/A</td>
                      <td className="p-3">64k - 256k</td>
                      <td className="p-3"><Badge variant="success" size="sm">Active</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "rest-api" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">REST API Reference</h2>
                <p className="text-xs text-surface-400 leading-relaxed">
                  All REST endpoints require JSON payload or multipart form data. Base URL: <code className="text-surface-200">http://localhost:5000/api/v1</code>
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-semibold border border-emerald-800/40">
                      POST
                    </span>
                    <span className="font-mono text-xs text-white">/api/video/upload-video</span>
                    <span className="text-xs text-surface-400 ml-auto">Submit multipart video file with options</span>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">
                    Uploads a source file directly to the transcoding queue validated with Zod.
                  </p>
                  <div className="bg-surface-950 p-3 rounded-lg border border-surface-800 font-mono text-xs text-surface-300">
                    <div className="flex justify-between items-center text-surface-500 pb-2 border-b border-surface-800/60 mb-2">
                      <span>Request (multipart/form-data)</span>
                      <button
                        onClick={() => copySnippet("api1", `curl -X POST http://localhost:3001/api/video/upload-video \\\n  -F "video=@clip.mp4" \\\n  -F 'options=["resize","convert"]' \\\n  -F "resolution=1920x1080" \\\n  -F "convertFormat=mp4"`)}
                        className="hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === "api1" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === "api1" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="text-surface-300 overflow-x-auto">
{`video: [Binary Stream]
options: ["resize", "convert", "trim", "watermark"]
resolution: "1920x1080"
trimStart: 0
trimDuration: 5
convertFormat: "mp4"
watermarkText: "Harmis & Heet"`}
                    </pre>
                  </div>
                </Card>

                <Card className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-xs font-semibold border border-blue-800/40">
                      GET
                    </span>
                    <span className="font-mono text-xs text-white">/jobs/:id</span>
                    <span className="text-xs text-surface-400 ml-auto">Fetch job status and logs</span>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">
                    Returns real-time progress, encoding metrics, and stdout/stderr stream snippets.
                  </p>
                </Card>

                <Card className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-mono text-xs font-semibold border border-rose-800/40">
                      DELETE
                    </span>
                    <span className="font-mono text-xs text-white">/jobs/:id</span>
                    <span className="text-xs text-surface-400 ml-auto">Cancel active transcoding process</span>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">
                    Sends SIGTERM / SIGKILL to the underlying worker child process and updates queue state.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "websocket" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">WebSocket Events</h2>
                <p className="text-xs text-surface-400 leading-relaxed">
                  Real-time telemetry event bus powered by Socket.IO. Listen to these events for live dashboard updates.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-emerald-400">job:progress</span>
                    <Badge variant="outline" size="sm">Frequency: 1000ms</Badge>
                  </div>
                  <p className="text-xs text-surface-400">
                    Fired on every frame batch calculation with encoding speed and progress percentage.
                  </p>
                  <pre className="bg-surface-950 p-3 rounded-lg border border-surface-800 font-mono text-xs text-surface-300 overflow-x-auto">
{`{
  "jobId": "job_9a8f23b1",
  "progress": 64.2,
  "fps": 58.4,
  "speed": "2.14x",
  "status": "processing",
  "log": "[ffmpeg] frame= 4820 fps=58.4 q=24.0 size= 98304kB"
}`}
                  </pre>
                </Card>

                <Card className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-blue-400">job:completed</span>
                    <Badge variant="outline" size="sm">Event Driven</Badge>
                  </div>
                  <p className="text-xs text-surface-400">
                    Emitted when output packaging finishes and the download artifact is ready.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "filters" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">FFmpeg Filtergraph</h2>
                <p className="text-xs text-surface-400 leading-relaxed">
                  Syntax for custom video filters and visual effects applied via the <code className="text-surface-200">-vf</code> argument.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 space-y-2">
                  <span className="font-mono text-xs text-white">Scale &amp; Aspect Padding</span>
                  <pre className="bg-surface-950 p-2.5 rounded border border-surface-800 font-mono text-[11px] text-surface-300">
scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2
                  </pre>
                </Card>

                <Card className="p-4 space-y-2">
                  <span className="font-mono text-xs text-white">Text Watermarking</span>
                  <pre className="bg-surface-950 p-2.5 rounded border border-surface-800 font-mono text-[11px] text-surface-300">
drawtext=text='StreamForge':fontcolor=white@0.8:fontsize=24:x=w-tw-20:y=h-th-20
                  </pre>
                </Card>

                <Card className="p-4 space-y-2">
                  <span className="font-mono text-xs text-white">Speed &amp; PTS Multiplier</span>
                  <pre className="bg-surface-950 p-2.5 rounded border border-surface-800 font-mono text-[11px] text-surface-300">
setpts=0.5*PTS (video) + atempo=2.0 (audio)
                  </pre>
                </Card>

                <Card className="p-4 space-y-2">
                  <span className="font-mono text-xs text-white">Color Adjustment</span>
                  <pre className="bg-surface-950 p-2.5 rounded border border-surface-800 font-mono text-[11px] text-surface-300">
hue=s=0 (Grayscale) / vignette=PI/4 (Vignette)
                  </pre>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "validation" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Zod Schema Specifications</h2>
                <p className="text-xs text-surface-400 leading-relaxed">
                  Backend schema definitions located in <code className="text-surface-200">server/src/modules/video/video.schema.ts</code>.
                </p>
              </div>

              <Card className="p-5 space-y-3">
                <div className="font-mono text-xs text-surface-400">TypeScript / Zod Definition</div>
                <pre className="bg-surface-950 p-4 rounded-xl border border-surface-800 font-mono text-xs text-surface-300 overflow-x-auto">
{`import { z } from "zod";
import { config } from "../../config";

export const uploadVideoSchema = z.object({
  body: z.object({
    options: z.union([
      z.string(),
      z.array(z.string()),
    ]).optional(),
    resolution: z.string().optional().default(config.constants.VIDEO.DEFAULT_RESOLUTION),
    trimStart: z.coerce.number().optional().default(config.constants.VIDEO.DEFAULT_TRIM_START),
    trimDuration: z.coerce.number().optional().default(config.constants.VIDEO.DEFAULT_TRIM_DURATION),
    convertFormat: z.string().optional().default(config.constants.VIDEO.DEFAULT_CONVERT_FORMAT),
    watermarkText: z.string().optional().default(config.constants.VIDEO.DEFAULT_WATERMARK_TEXT),
  }),
});

export type UploadVideoInput = z.infer<typeof uploadVideoSchema>["body"];`}
                </pre>
              </Card>
            </div>
          )}

          {activeSection === "errors" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Error Handling &amp; Retries</h2>
                <p className="text-xs text-surface-400 leading-relaxed">
                  Automatic recovery mechanisms for worker crashes and corrupted input files.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-4 space-y-2">
                  <div className="font-semibold text-xs text-white">ERR_CORRUPT_MOOV_ATOM</div>
                  <p className="text-xs text-surface-400">
                    Triggered when input MP4 has truncated moov atom header. System automatically attempts index reconstruction.
                  </p>
                </Card>
                <Card className="p-4 space-y-2">
                  <div className="font-semibold text-xs text-white">ERR_NVENC_RESOURCE_EXHAUSTED</div>
                  <p className="text-xs text-surface-400">
                    If GPU hardware encoder channels are occupied, worker automatically falls back to multi-threaded CPU libx264/libx265.
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
