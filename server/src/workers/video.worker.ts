import fs from "fs";
import { Queue, Worker } from "bullmq";
import { connection, pubClient } from "../lib/redis";
import { config } from "../config";
import { processVideoLogic } from "./ffmpeg.util";

export const videoProcessQueue = new Queue(config.constants.QUEUES.TRANSCODING, { connection });

export const startVideoWorker = () => {
  const worker = new Worker(
    config.constants.QUEUES.TRANSCODING,
    async (job) => {
      console.log(`[Worker] Received job ${job.id}:`, job.data);
      const outputFiles = await processVideoLogic(job.id, job.data);
      return outputFiles;
    },
    { connection }
  );

  worker.on("active", async (job) => {
    pubClient.publish(
      config.constants.CHANNELS.PROCESSING_UPDATES,
      JSON.stringify({
        jobId: job.id,
        status: "processing",
      })
    );
    console.log(`[Worker] Job ${job.id} is now active`);
  });

  worker.on("completed", (job, returnvalue) => {
    const downloadUrls = returnvalue.map((file: string) => `http://localhost:${config.env.PORT}/downloads/${file}`);
    const payload = {
      jobId: job.id,
      status: "completed",
      downloadUrls: downloadUrls,
    };
    pubClient.publish(config.constants.CHANNELS.PROCESSING_UPDATES, JSON.stringify(payload));

    console.log(`[Worker] Job ${job.id} has completed`);
    if (job?.data?.path && fs.existsSync(job.data.path)) {
      fs.unlinkSync(job.data.path);
    }
  });

  worker.on("failed", (job, err) => {
    pubClient.publish(
      config.constants.CHANNELS.PROCESSING_UPDATES,
      JSON.stringify({
        jobId: job?.id,
        status: "failed",
        error: err.message,
      })
    );
    console.error(`[Worker] Job ${job?.id} failed with error:`, err);
    if (job?.data?.path && fs.existsSync(job.data.path)) {
      fs.unlinkSync(job.data.path);
    }
  });

  return worker;
};
