export const VIDEO_CONTAINERS = [
  { value: "mp4", label: "MP4 (MPEG-4 Part 14)", desc: "Universal web and device compatibility" },
  { value: "mkv", label: "MKV (Matroska)", desc: "Supports multi-audio and high fidelity tracks" },
  { value: "webm", label: "WebM", desc: "Optimized for HTML5 video playback" },
  { value: "mov", label: "MOV (QuickTime)", desc: "Standard for macOS and Apple ecosystems" },
  { value: "avi", label: "AVI (Audio Video Interleave)", desc: "Legacy format for Windows media" }
] as const;

export const VIDEO_CODECS = [
  { value: "libx264", label: "H.264 / AVC (libx264)", desc: "Maximum compatibility across all hardware" },
  { value: "libx265", label: "H.265 / HEVC (libx265)", desc: "50% bitrate reduction with high fidelity" },
  { value: "libvpx-vp9", label: "VP9 (libvpx-vp9)", desc: "Royalty-free open standard for web delivery" },
  { value: "libsvtav1", label: "AV1 (SVT-AV1)", desc: "Next-generation ultra-dense compression" },
  { value: "copy", label: "Stream Copy (Passthrough)", desc: "Bypasses re-encoding for instant remuxing" }
] as const;

export const AUDIO_CODECS = [
  { value: "aac", label: "AAC (Advanced Audio Coding)", desc: "Standard high quality stereo/multichannel" },
  { value: "libmp3lame", label: "MP3 (LAME)", desc: "Ubiquitous legacy audio codec" },
  { value: "libopus", label: "Opus", desc: "State of the art speech and music compression" },
  { value: "flac", label: "FLAC", desc: "Lossless audio encoding for master tracks" },
  { value: "none", label: "Mute Audio Track", desc: "Strips all audio streams from output" },
  { value: "copy", label: "Stream Copy", desc: "Preserves input audio stream untouched" }
] as const;

export const RESOLUTION_PRESETS = [
  { value: "source", label: "Original (Source Resolution)", width: null, height: null },
  { value: "3840x2160", label: "4K UHD (3840x2160)", width: 3840, height: 2160 },
  { value: "2560x1440", label: "1440p QHD (2560x1440)", width: 2560, height: 1440 },
  { value: "1920x1080", label: "1080p FHD (1920x1080)", width: 1920, height: 1080 },
  { value: "1280x720", label: "720p HD (1280x720)", width: 1280, height: 720 },
  { value: "854x480", label: "480p SD (854x480)", width: 854, height: 480 },
  { value: "640x360", label: "360p Mobile (640x360)", width: 640, height: 360 }
] as const;

export const ENCODER_PRESETS = [
  { value: "ultrafast", label: "Ultrafast", speed: "Maximum", efficiency: "Low" },
  { value: "superfast", label: "Superfast", speed: "Very High", efficiency: "Moderate" },
  { value: "veryfast", label: "Veryfast", speed: "High", efficiency: "Standard" },
  { value: "faster", label: "Faster", speed: "Good", efficiency: "Balanced" },
  { value: "fast", label: "Fast", speed: "Balanced", efficiency: "High" },
  { value: "medium", label: "Medium (Default)", speed: "Standard", efficiency: "Optimal" },
  { value: "slow", label: "Slow", speed: "Slow", efficiency: "Superior" },
  { value: "slower", label: "Slower", speed: "Very Slow", efficiency: "Maximum" }
] as const;

export const VIDEO_FILTERS = [
  { id: "grayscale", label: "Grayscale (hue=s=0)", param: "hue=s=0" },
  { id: "sepia", label: "Sepia Tone", param: "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131" },
  { id: "vignette", label: "Vignette Effect", param: "vignette=PI/4" },
  { id: "boxblur", label: "Gaussian Blur", param: "boxblur=2:1" },
  { id: "unsharp", label: "Sharpen (Unsharp Mask)", param: "unsharp=5:5:1.0:5:5:0.0" },
  { id: "hflip", label: "Horizontal Flip", param: "hflip" },
  { id: "vflip", label: "Vertical Flip", param: "vflip" }
] as const;
