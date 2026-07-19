import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Shield, Cpu } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-800 bg-surface-950 text-surface-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-surface-900 border border-surface-800 flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-surface-200" />
              </div>
              <span className="font-semibold text-surface-100 text-sm">StreamForge Engine</span>
            </div>
            <p className="text-surface-500 text-xs leading-relaxed">
              Industrial grade distributed video transcoding platform powered by FFmpeg, Redis message queues, and real-time WebSocket orchestration.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-surface-200 mb-3 uppercase tracking-wider text-[11px]">Architecture</h4>
            <ul className="space-y-2 text-surface-400">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-surface-500" /> Hardware: NVENC / QSV / VAAPI</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-surface-500" /> Sandboxed Worker Pool</li>
              <li>SVT-AV1 &amp; libvpx-vp9 Pipeline</li>
              <li>Chunked Faststart MP4 Muxing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-surface-200 mb-3 uppercase tracking-wider text-[11px]">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-surface-200 transition-colors">Overview</Link></li>
              <li><Link to="/workspace" className="hover:text-surface-200 transition-colors">Video Studio</Link></li>
              <li><Link to="/dashboard" className="hover:text-surface-200 transition-colors">Cluster Dashboard</Link></li>
              <li><Link to="/docs" className="hover:text-surface-200 transition-colors">API Reference &amp; Specs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-surface-200 mb-3 uppercase tracking-wider text-[11px]">Cluster Metrics</h4>
            <div className="space-y-2 text-surface-400">
              <div className="flex justify-between border-b border-surface-900 pb-1">
                <span>Core Engine:</span>
                <span className="font-mono text-surface-300">FFmpeg 7.0.2</span>
              </div>
              <div className="flex justify-between border-b border-surface-900 pb-1">
                <span>Protocol:</span>
                <span className="font-mono text-surface-300">Socket.IO v4</span>
              </div>
              <div className="flex justify-between">
                <span>Worker Status:</span>
                <span className="text-emerald-400 font-mono">HEALTHY (0 Errors)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-surface-500 text-[11px]">
            StreamForge High-Throughput Media Processing System. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-surface-500 text-[11px]">
            <span className="font-mono">BUILD 2026.08-STABLE</span>
            <span>-</span>
            <span className="hover:text-surface-300 cursor-pointer">Security Policy</span>
            <span>-</span>
            <span className="hover:text-surface-300 cursor-pointer">Worker Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
