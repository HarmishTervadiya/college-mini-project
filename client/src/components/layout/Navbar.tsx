import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Play, Cpu, Layers, BookOpen, Activity, Terminal } from "lucide-react";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/Badge";

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Overview", icon: Layers },
    { to: "/workspace", label: "Studio", icon: Play },
    { to: "/dashboard", label: "Job Cluster", icon: Activity },
    { to: "/docs", label: "API Reference", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-800 bg-surface-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-surface-900 border border-surface-700/80 flex items-center justify-center group-hover:border-surface-600 transition-colors">
              <Terminal className="w-4 h-4 text-surface-200" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-white">StreamForge</span>
              <span className="text-[10px] font-mono text-surface-400">FFmpeg 7.0</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-surface-850 text-white border border-surface-750 bg-surface-800/90"
                      : "text-surface-400 hover:text-surface-200 hover:bg-surface-900"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-surface-400">Nodes: 8/8 Online</span>
          </div>

          <Badge variant="outline" size="sm" className="hidden lg:inline-flex">
            <Cpu className="w-3 h-3 text-surface-400" />
            NVENC + SVT-AV1
          </Badge>

          <Link
            to="/workspace"
            className="inline-flex items-center justify-center text-xs font-medium bg-surface-100 text-surface-950 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
          >
            Launch Studio
          </Link>
        </div>
      </div>
    </header>
  );
};
