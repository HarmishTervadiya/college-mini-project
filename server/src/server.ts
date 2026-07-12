import http from "http";
import app from "./app";
import { config } from "./config";
import { connection } from "./lib/redis";
import { setupWebSocket } from "./lib/websocket";

const server = http.createServer(app);
setupWebSocket(server);

server.listen(config.env.PORT, () => {
  console.log(`🚀 API Server running securely on port ${config.env.PORT}`);
  connection.on("ready", () => console.log("🔌 Redis Connection Established Successfully"));
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => process.exit(1));
});