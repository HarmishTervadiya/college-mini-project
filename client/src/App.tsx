import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { JobsProvider } from "./features/video/jobsStore";

export const App: React.FC = () => {
  return (
    <JobsProvider>
      <RouterProvider router={router} />
    </JobsProvider>
  );
};

export default App;
