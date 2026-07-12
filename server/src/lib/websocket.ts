import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { subClient } from "./redis";
import { config } from "../config";

export function setupWebSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected via Socket.IO:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  subClient.subscribe(config.constants.CHANNELS.PROCESSING_UPDATES, (err) => {
    if (err) {
      console.error(`Failed to subscribe to ${config.constants.CHANNELS.PROCESSING_UPDATES}`, err);
    } else {
      console.log(`Subscribed to ${config.constants.CHANNELS.PROCESSING_UPDATES} channel`);
    }
  });

  subClient.on("message", (channel, message) => {
    if (channel === config.constants.CHANNELS.PROCESSING_UPDATES) {
      try {
        const payload = JSON.parse(message);
        io.emit("job_update", payload);
      } catch (error) {
        console.error("Failed to parse Redis message:", error);
      }
    }
  });
}
