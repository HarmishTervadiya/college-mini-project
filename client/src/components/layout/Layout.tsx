import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "../../utils/cn";

const links = [
  { to: "/", label: "Overview" },
  { to: "/workspace", label: "New job" },
  { to: "/dashboard", label: "Jobs" },
  { to: "/docs", label: "Docs" },
];

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="font-semibold text-slate-900">
            Video Processor
          </Link>
          <nav className="flex items-center gap-1" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 rounded-md text-sm",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-sm text-slate-500 flex flex-wrap gap-2 justify-between">
          <span>FFmpeg processing queue.</span>
          <span className="font-mono text-xs">POST /api/video/upload-video</span>
        </div>
      </footer>
    </div>
  );
};
