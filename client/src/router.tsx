import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Landing } from "./pages/Landing";
import { Workspace } from "./pages/Workspace";
import { Dashboard } from "./pages/Dashboard";
import { Docs } from "./pages/Docs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: "workspace",
        element: <Workspace />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "docs",
        element: <Docs />
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
