import http from "http";
import app from "./app";
import { config } from "./config";

const server = http.createServer(app);

server.listen(config.env.PORT, () => {
  console.log(`🚀 API Server running securely on port ${config.env.PORT}`);
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => process.exit(1));
});