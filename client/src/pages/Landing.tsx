import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Cpu, 
  Zap, 
  Layers, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  FileVideo, 
  HardDrive, 
  Copy, 
  Check 
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const Landing: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"cli" | "node" | "python">("cli");

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    cli: `curl -X POST http://localhost:3001/api/video/upload-video \\
  -F "video=@input_master.mov" \\
  -F 'options=["resize","convert"]' \\
  -F "resolution=1920x1080" \\
  -F "convertFormat=mp4"`,
    node: `import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const form = new FormData();
form.append("video", fs.createReadStream("input.mov"));
form.append("options", JSON.stringify(["resize", "convert"]));
form.append("resolution", "1920x1080");
form.append("convertFormat", "mp4");

const { data } = await axios.post("http://localhost:3001/api/video/upload-video", form, {
  headers: form.getHeaders()
});
console.log("Job ID:", data.data.jobId);`,
    python: `import requests

files = {'video': open('input.mov', 'rb')}
payload = {
    'options': '["resize","convert"]',
    'resolution': '1920x1080',
    'convertFormat': 'mp4'
}

response = requests.post('http://localhost:3001/api/video/upload-video', files=files, data=payload)
print("Queued Job:", response.json())`
  };

  return (
    <div className="space-y-24 py-6">
      <section className="relative text-center max-w-4xl mx-auto space-y-8 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-surface-800 bg-surface-900/80 text-xs font-mono text-surface-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>StreamForge v2.4 Architecture</span>
          <span className="text-surface-600">|</span>
          <span className="text-surface-400">Distributed Transcoder</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Industrial Video Processing <br />
          <span className="text-surface-400">Built for Modern Infrastructure</span>
        </h1>

        <p className="text-base sm:text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed">
          Scale your FFmpeg transcoding pipelines across distributed worker clusters.
          Engineered with real-time Socket.IO telemetry, hardware acceleration, and strict Zod validation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/workspace">
            <Button size="lg" className="shadow-lg shadow-surface-100/5">
              Launch Studio
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" size="lg">
              <Activity className="w-4 h-4 text-surface-400" />
              Live Cluster Dashboard
            </Button>
          </Link>
          <Link to="/docs">
            <Button variant="outline" size="lg">
              API Documentation
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 text-left">
          <Card className="p-4 bg-surface-900/40">
            <div className="text-xs font-mono text-surface-500 uppercase">Throughput</div>
            <div className="text-xl font-bold text-white mt-1">485.6 Mbps</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Peak cluster rate</div>
          </Card>
          <Card className="p-4 bg-surface-900/40">
            <div className="text-xs font-mono text-surface-500 uppercase">Avg Encoding Speed</div>
            <div className="text-xl font-bold text-white mt-1">2.4x Real-time</div>
            <div className="text-[11px] text-surface-400 mt-0.5">NVENC + SVT-AV1</div>
          </Card>
          <Card className="p-4 bg-surface-900/40">
            <div className="text-xs font-mono text-surface-500 uppercase">Active Workers</div>
            <div className="text-xl font-bold text-white mt-1">8 Instances</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Zero queue latency</div>
          </Card>
          <Card className="p-4 bg-surface-900/40">
            <div className="text-xs font-mono text-surface-500 uppercase">Pipeline Latency</div>
            <div className="text-xl font-bold text-white mt-1">&lt; 12ms</div>
            <div className="text-[11px] text-surface-400 mt-0.5">Job ingestion to worker</div>
          </Card>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Distributed Pipeline Architecture
          </h2>
          <p className="text-xs sm:text-sm text-surface-400">
            End-to-end media lifecycle from HTTP ingestion through worker distribution and output artifact packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-5 flex flex-col justify-between border-surface-800">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200">
                <FileVideo className="w-4 h-4" />
              </div>
              <div className="font-semibold text-sm text-surface-100">1. Ingestion</div>
              <p className="text-xs text-surface-400 leading-relaxed">
                Multipart streaming upload with MIME inspection and schema verification.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-800/80 font-mono text-[10px] text-surface-500">
              Chunked Buffer Stream
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between border-surface-800">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200">
                <Layers className="w-4 h-4" />
              </div>
              <div className="font-semibold text-sm text-surface-100">2. Job Dispatcher</div>
              <p className="text-xs text-surface-400 leading-relaxed">
                Redis priority queue dispatches jobs with automatic failover and heartbeat.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-800/80 font-mono text-[10px] text-surface-500">
              Redis Queue + BullMQ
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between border-surface-800">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="font-semibold text-sm text-surface-100">3. Transcode Node</div>
              <p className="text-xs text-surface-400 leading-relaxed">
                Sandboxed worker executes FFmpeg with CPU / NVENC hardware pipelines.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-800/80 font-mono text-[10px] text-surface-500">
              FFmpeg 7.0 Worker
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between border-surface-800">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200">
                <Activity className="w-4 h-4" />
              </div>
              <div className="font-semibold text-sm text-surface-100">4. Live Telemetry</div>
              <p className="text-xs text-surface-400 leading-relaxed">
                Socket.IO broadcasts stderr frame progress, encoding speed, and ETA.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-800/80 font-mono text-[10px] text-surface-500">
              WebSocket Event Bus
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between border-surface-800">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-200">
                <HardDrive className="w-4 h-4" />
              </div>
              <div className="font-semibold text-sm text-surface-100">5. Storage Delivery</div>
              <p className="text-xs text-surface-400 leading-relaxed">
                Faststart moov atom optimization with S3 artifact retention and CDN links.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-800/80 font-mono text-[10px] text-surface-500">
              +faststart Muxing
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Core Engine Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-surface-400">
            Engineered to handle complex media pipelines with enterprise predictability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-surface-800 border border-surface-700/80 flex items-center justify-center text-surface-200">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Hardware Acceleration</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              Support for NVIDIA NVENC, Intel QuickSync Video (QSV), and Linux VAAPI hardware encoders for high-speed batch transcoding.
            </p>
          </Card>

          <Card hover className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-surface-800 border border-surface-700/80 flex items-center justify-center text-surface-200">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Filtergraph Orchestration</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              Dynamic multi-filter chaining including smart crop, burn-in watermarking, FPS interpolation, and audio track extraction.
            </p>
          </Card>

          <Card hover className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-surface-800 border border-surface-700/80 flex items-center justify-center text-surface-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Strict Schema Validation</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              Every job payload is strictly validated against backend Zod schemas to eliminate malformed FFmpeg parameter crashes.
            </p>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Developer Quickstart</h2>
            <p className="text-xs text-surface-400 mt-1">
              Submit transcoding jobs programmatically using standard HTTP interfaces.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-900 p-1 rounded-lg border border-surface-800">
            <button
              onClick={() => setActiveTab("cli")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === "cli" ? "bg-surface-800 text-white" : "text-surface-400 hover:text-surface-200"
              }`}
            >
              cURL CLI
            </button>
            <button
              onClick={() => setActiveTab("node")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === "node" ? "bg-surface-800 text-white" : "text-surface-400 hover:text-surface-200"
              }`}
            >
              Node.js
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === "python" ? "bg-surface-800 text-white" : "text-surface-400 hover:text-surface-200"
              }`}
            >
              Python
            </button>
          </div>
        </div>

        <div className="relative rounded-xl border border-surface-800 bg-surface-950 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-900/70 border-b border-surface-800 text-xs font-mono text-surface-400">
            <span>Terminal</span>
            <button
              onClick={() => copyCode(codeSnippets[activeTab])}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy snippet"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-surface-200 overflow-x-auto leading-relaxed">
            {codeSnippets[activeTab]}
          </pre>
        </div>
      </section>

      <section className="border border-surface-800 rounded-2xl p-8 bg-surface-900/50 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-bold text-white">Ready to process high-definition video?</h3>
          <p className="text-xs sm:text-sm text-surface-400">
            Open the Studio workspace to configure codecs, resolution scaling, and filters with instant FFmpeg command generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/workspace">
            <Button size="lg">Open Video Studio</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg">Cluster Telemetry</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
