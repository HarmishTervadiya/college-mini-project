import { startVideoWorker } from "./video.worker";

export const startAllWorkers = () => {
  console.log("Starting all background workers...");
  startVideoWorker();
};
