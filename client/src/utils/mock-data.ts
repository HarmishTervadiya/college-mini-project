export interface VideoJob {
  id: string;
  filename: string;
  originalSize: number;
  outputSize?: number;
  container: string;
  videoCodec: string;
  audioCodec: string;
  resolution: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  fps?: number;
  speed?: string;
  eta?: string;
  createdAt: string;
  completedAt?: string;
  outputUrl?: string;
  logs: string[];
  command: string;
}

export const INITIAL_MOCK_JOBS: VideoJob[] = [
  {
    id: "job_9a8f23b1-4c12",
    filename: "cinematic_drone_4k_hdr.mov",
    originalSize: 842000000,
    outputSize: 142000000,
    container: "mp4",
    videoCodec: "libx265",
    audioCodec: "aac",
    resolution: "1920x1080",
    status: "completed",
    progress: 100,
    fps: 58.4,
    speed: "2.14x",
    eta: "00:00:00",
    createdAt: "2026-08-23T14:10:00.000Z",
    completedAt: "2026-08-23T14:14:22.000Z",
    outputUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    logs: [
      "[ffmpeg] Input #0, mov,mp4,m4a,3gp,3g2,mj2 from 'cinematic_drone_4k_hdr.mov'",
      "[ffmpeg] Stream #0:0(eng): Video: hevc (Main 10) (hvc1 / 0x31637668), yuv420p10le(tv, bt2020nc/bt2020/smpte2084), 3840x2160, 48210 kb/s, 59.94 fps",
      "[ffmpeg] Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 320 kb/s",
      "[ffmpeg] Stream mapping: Stream #0:0 -> #0:0 (hevc (native) -> hevc (libx265)), Stream #0:1 -> #0:1 (aac (native) -> aac (native))",
      "[libx265 @ 0x7f884a00] x265 [info]: HEVC encoder created, version 3.5",
      "[ffmpeg] frame= 4820 fps=58.4 q=24.0 size= 98304kB time=00:01:20.41 bitrate=10008.2kbits/s speed=2.14x",
      "[ffmpeg] frame= 9100 fps=59.1 q=22.0 size= 138752kB time=00:02:31.80 bitrate=7482.1kbits/s speed=2.18x",
      "[ffmpeg] video:138240kB audio:3512kB subtitle:0kB other streams:0kB global headers:2kB muxing overhead: 0.18%",
      "[pipeline] Transcoding completed in 262 seconds. Output verified."
    ],
    command: "ffmpeg -i cinematic_drone_4k_hdr.mov -c:v libx265 -preset medium -crf 22 -vf scale=1920:1080 -c:a aac -b:a 192k -movflags +faststart output_drone.mp4"
  },
  {
    id: "job_b32e18fa-71d0",
    filename: "product_launch_keynote.mp4",
    originalSize: 1450000000,
    container: "webm",
    videoCodec: "libvpx-vp9",
    audioCodec: "libopus",
    resolution: "1920x1080",
    status: "processing",
    progress: 68,
    fps: 42.1,
    speed: "1.45x",
    eta: "00:01:14",
    createdAt: "2026-08-23T15:30:00.000Z",
    logs: [
      "[ffmpeg] Input #0, mov,mp4,m4a from 'product_launch_keynote.mp4'",
      "[ffmpeg] Stream #0:0: Video: h264 (High) (avc1 / 0x31637661), yuv420p(progressive), 1920x1080, 18500 kb/s, 60 fps",
      "[ffmpeg] Stream #0:1: Audio: aac (LC), 48000 Hz, stereo, 256 kb/s",
      "[libvpx-vp9 @ 0x55d2] v1.11.0-128-g92",
      "[ffmpeg] frame= 3410 fps=42.1 q=0.0 size= 42100kB time=00:00:56.83 bitrate=6068.3kbits/s speed=1.45x"
    ],
    command: "ffmpeg -i product_launch_keynote.mp4 -c:v libvpx-vp9 -b:v 2800k -crf 30 -c:a libopus -b:a 128k output_keynote.webm"
  },
  {
    id: "job_c47120de-889a",
    filename: "podcast_interview_ep42.mkv",
    originalSize: 2100000000,
    container: "mp4",
    videoCodec: "libx264",
    audioCodec: "aac",
    resolution: "1280x720",
    status: "queued",
    progress: 0,
    createdAt: "2026-08-23T15:45:00.000Z",
    logs: [
      "[queue] Task received and validated against video schema",
      "[worker] Assigned to cluster node-us-east-worker-04",
      "[status] Waiting for slot in transcode worker pool..."
    ],
    command: "ffmpeg -i podcast_interview_ep42.mkv -c:v libx264 -preset fast -crf 24 -vf scale=1280:720 -c:a aac -b:a 128k output_podcast.mp4"
  }
];

export const CLUSTER_METRICS = {
  activeWorkers: 8,
  totalQueued: 3,
  processedToday: 142,
  throughputMbps: 485.6,
  avgTranscodeSpeed: "2.4x",
  clusterHealth: "Optimal",
  activeNodes: [
    { name: "worker-node-01", region: "us-east", cpu: "42%", memory: "58%", jobs: 2, status: "healthy" },
    { name: "worker-node-02", region: "us-west", cpu: "78%", memory: "82%", jobs: 3, status: "busy" },
    { name: "worker-node-03", region: "eu-central", cpu: "14%", memory: "31%", jobs: 1, status: "healthy" },
    { name: "worker-node-04", region: "ap-southeast", cpu: "04%", memory: "22%", jobs: 0, status: "idle" }
  ]
};
