import Redis from "ioredis";
import { config } from "../config";

export const connection = new Redis(config.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const pubClient = new Redis(config.env.REDIS_URL);
export const subClient = pubClient.duplicate();

connection.on("error", (err) => console.error("Redis Connection Error", err));
pubClient.on("error", (err) => console.error("Redis PubClient Error", err));
subClient.on("error", (err) => console.error("Redis SubClient Error", err));
