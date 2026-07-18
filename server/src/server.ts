import http from "http";
import app from "./app";
import { config } from "./config";
import { connection } from "./lib/redis";
import { setupWebSocket } from "./lib/websocket";
import { startAllWorkers } from "./workers";
import ffmpeg from "fluent-ffmpeg";

const server = http.createServer(app);
setupWebSocket(server);
startAllWorkers();

server.listen(config.env.PORT, () => {
  console.log(`🚀 API Server running securely on port ${config.env.PORT} in ${config.env.NODE_ENV} mode`);
  connection.on("ready", () => console.log("🔌 Redis Connection Established Successfully"));
  
  ffmpeg.getAvailableFormats((err, formats) => {
    if (err) console.warn("⚠️ FFmpeg startup check failed (Ensure ffmpeg is installed):", err.message);
    else console.log(`🎥 FFmpeg startup check passed! Found ${Object.keys(formats || {}).length} formats.`);
  });
});

process.on("unhandledRejection", (err: any) => {
  console.error("❌ UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});