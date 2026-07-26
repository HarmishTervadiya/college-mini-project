import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Slider } from "../components/ui/Slider";
import { Badge } from "../components/ui/Badge";
import { 
  VIDEO_CONTAINERS, 
  VIDEO_CODECS, 
  AUDIO_CODECS, 
  RESOLUTION_PRESETS, 
  ENCODER_PRESETS,
  VIDEO_FILTERS
} from "../utils/constants";
import { generateFfmpegCommand, JobOptions } from "../utils/ffmpeg-generator";
import { formatBytes } from "../utils/formatters";
import { videoApi, VideoProcessingPayload } from "../lib/axios";
import { socketService } from "../lib/socket";
import PRESETS from "../assets/presets.json";
import { 
  Upload, 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  FileVideo,
  X,
  Play,
  RotateCcw
} from "lucide-react";

export const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const [form, setForm] = useState<JobOptions>({
    container: "mp4",
    videoCodec: "libx264",
    audioCodec: "aac",
    resolution: "1920x1080",
    preset: "medium",
    crf: 23,
    videoBitrate: "",
    audioBitrate: "192k",
    fps: undefined,
    startTime: undefined,
    endTime: undefined,
    speedMultiplier: 1,
    filters: [],
    watermarkText: "",
    watermarkPosition: "bottom-right",
    outputName: ""
  });

  const handleSelectedFile = (selectedFile: File) => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setVideoPreviewUrl(url);
    const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    setForm((prev) => ({
      ...prev,
      filename: selectedFile.name,
      outputName: `${nameWithoutExt}_transcoded`
    }));
  };

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/") || droppedFile.name.match(/\.(mp4|mkv|mov|webm|avi)$/i)) {
        handleSelectedFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setActivePresetId(preset.id);
    setForm((prev) => ({
      ...prev,
      container: preset.container,
      videoCodec: preset.videoCodec,
      audioCodec: preset.audioCodec,
      resolution: preset.resolution,
      preset: preset.preset,
      crf: preset.crf,
      audioBitrate: preset.audioBitrate || prev.audioBitrate
    }));
  };

  const toggleFilter = (filterParam: string) => {
    setForm((prev) => {
      const current = prev.filters || [];
      const exists = current.includes(filterParam);
      return {
        ...prev,
        filters: exists ? current.filter((f) => f !== filterParam) : [...current, filterParam]
      };
    });
  };

  const ffmpegCommand = generateFfmpegCommand(form);

  const copyCommand = () => {
    navigator.clipboard.writeText(ffmpegCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: VideoProcessingPayload = {
        filename: form.filename || file?.name || "input.mp4",
        outputName: form.outputName,
        container: form.container,
        videoCodec: form.videoCodec,
        audioCodec: form.audioCodec,
        resolution: form.resolution,
        preset: form.preset,
        crf: form.crf,
        videoBitrate: form.videoBitrate || undefined,
        audioBitrate: form.audioBitrate || undefined,
        fps: form.fps,
        startTime: form.startTime,
        endTime: form.endTime,
        speedMultiplier: form.speedMultiplier,
        filters: form.filters,
        watermarkText: form.watermarkText || undefined,
        watermarkPosition: form.watermarkPosition
      };

      const res = await videoApi.submitJob(payload, file || undefined);

      if (res.data) {
        socketService.simulateJobProgress(res.data);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setVideoPreviewUrl(null);
    setActivePresetId(null);
    setForm({
      container: "mp4",
      videoCodec: "libx264",
      audioCodec: "aac",
      resolution: "1920x1080",
      preset: "medium",
      crf: 23,
      videoBitrate: "",
      audioBitrate: "192k",
      fps: undefined,
      startTime: undefined,
      endTime: undefined,
      speedMultiplier: 1,
      filters: [],
      watermarkText: "",
      watermarkPosition: "bottom-right",
      outputName: ""
    });
  };

  const getCrfDescription = (crf: number) => {
    if (crf === 0) return "Lossless (Extremely large file)";
    if (crf <= 18) return "Visually Lossless (High quality master)";
    if (crf <= 24) return "Standard Web Quality (Balanced)";
    if (crf <= 30) return "Medium Compression (Good for sharing)";
    return "High Compression (Small file, visible artifacts)";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Video Transcoding Studio"
        description="Configure hardware accelerated video encodings, custom resolution scaling, and filtergraphs with live FFmpeg CLI preview generation."
        badge={
          <Badge variant="outline" size="sm">
            <Layers className="w-3 h-3 text-surface-400" />
            Configurator
          </Badge>
        }
        actions={
          <Button variant="outline" size="sm" onClick={resetForm}>
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </Button>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-surface-400">
          <Sparkles className="w-3.5 h-3.5 text-surface-300" />
          <span>Quick Transcoding Presets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isSelected
                    ? "bg-surface-800 border-surface-600 shadow-xs"
                    : "bg-surface-900/60 border-surface-800 hover:bg-surface-900 hover:border-surface-700"
                }`}
              >
                <div className="font-semibold text-xs text-white truncate">{p.name}</div>
                <div className="text-[11px] text-surface-400 mt-1 line-clamp-2 leading-relaxed">
                  {p.description}
                </div>
                <div className="mt-2.5 flex items-center gap-1 font-mono text-[10px] text-surface-500">
                  <span>{p.videoCodec}</span>
                  <span>-</span>
                  <span>{p.container.toUpperCase()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 border-0 mb-4">
              <CardTitle>1. Source Video Ingestion</CardTitle>
              <CardDescription>
                Upload a video file for inspection and transcoding. Supported formats include MP4, MKV, MOV, WebM, and AVI.
              </CardDescription>
            </CardHeader>

            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-surface-400 bg-surface-800/40"
                    : "border-surface-800 hover:border-surface-700 bg-surface-950/40 hover:bg-surface-900/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,.mkv,.mov,.webm,.avi"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-surface-200">
                      Click to browse or drag and drop video file
                    </p>
                    <p className="text-[11px] text-surface-500 mt-1">
                      Up to 2GB per chunk. Hardware probe analyzes tracks automatically.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-950 border border-surface-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-200">
                      <FileVideo className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{file.name}</div>
                      <div className="text-[11px] font-mono text-surface-400 mt-0.5">
                        Size: {formatBytes(file.size)} | MIME: {file.type || "video/container"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {videoPreviewUrl && (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-60 border border-surface-800 flex items-center justify-center">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-6">
            <CardHeader className="p-0 border-0 mb-2">
              <CardTitle>2. Transcoding &amp; Codec Profile</CardTitle>
              <CardDescription>
                Define target container, encoder libraries, and quality control parameters.
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Target Container Format"
                options={VIDEO_CONTAINERS}
                value={form.container}
                onChange={(e) => setForm({ ...form, container: e.target.value })}
              />

              <Select
                label="Video Codec (Encoder Library)"
                options={VIDEO_CODECS}
                value={form.videoCodec}
                onChange={(e) => setForm({ ...form, videoCodec: e.target.value })}
              />

              <Select
                label="Target Resolution"
                options={RESOLUTION_PRESETS}
                value={form.resolution}
                onChange={(e) => setForm({ ...form, resolution: e.target.value })}
              />

              <Select
                label="Audio Codec"
                options={AUDIO_CODECS}
                value={form.audioCodec}
                onChange={(e) => setForm({ ...form, audioCodec: e.target.value })}
              />

              <Select
                label="Encoder Preset (Speed vs Efficiency)"
                options={ENCODER_PRESETS}
                value={form.preset}
                onChange={(e) => setForm({ ...form, preset: e.target.value })}
              />

              <Input
                label="Output File Basename"
                value={form.outputName || ""}
                placeholder="output_video"
                onChange={(e) => setForm({ ...form, outputName: e.target.value })}
                hint={`Will be saved as ${form.outputName || "output"}.${form.container}`}
              />
            </div>

            {form.videoCodec !== "copy" && (
              <div className="pt-2">
                <Slider
                  label="Constant Rate Factor (CRF Quality)"
                  value={form.crf}
                  min={0}
                  max={51}
                  step={1}
                  onChange={(val) => setForm({ ...form, crf: val })}
                  helpText={getCrfDescription(form.crf)}
                />
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-6">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <div>
                <CardTitle>3. Filtergraph &amp; Advanced Options</CardTitle>
                <CardDescription>
                  Trimming, playback speed multipliers, text watermarks, and video filters.
                </CardDescription>
              </div>
              <button type="button" className="p-1 rounded-lg text-surface-400 hover:text-white">
                {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showAdvanced && (
              <div className="space-y-6 pt-4 border-t border-surface-800/80 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Start Time (seconds)"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.startTime !== undefined ? form.startTime : ""}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />

                  <Input
                    label="End Time (seconds)"
                    type="number"
                    min="0"
                    placeholder="Duration"
                    value={form.endTime !== undefined ? form.endTime : ""}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />

                  <Select
                    label="Playback Speed"
                    value={form.speedMultiplier?.toString() || "1"}
                    options={[
                      { value: "0.5", label: "0.5x (Slow Motion)" },
                      { value: "0.75", label: "0.75x" },
                      { value: "1", label: "1.0x (Normal Speed)" },
                      { value: "1.25", label: "1.25x" },
                      { value: "1.5", label: "1.5x" },
                      { value: "2", label: "2.0x (Double Speed)" }
                    ]}
                    onChange={(e) => setForm({ ...form, speedMultiplier: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Text Watermark Overlay"
                    placeholder="e.g. StreamForge Production"
                    value={form.watermarkText || ""}
                    onChange={(e) => setForm({ ...form, watermarkText: e.target.value })}
                  />

                  <Select
                    label="Watermark Position"
                    value={form.watermarkPosition || "bottom-right"}
                    options={[
                      { value: "top-left", label: "Top Left" },
                      { value: "top-right", label: "Top Right" },
                      { value: "bottom-left", label: "Bottom Left" },
                      { value: "bottom-right", label: "Bottom Right" },
                      { value: "center", label: "Center Screen" }
                    ]}
                    onChange={(e) => setForm({ ...form, watermarkPosition: e.target.value as any })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-surface-300">
                    Video Filters &amp; Effects
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VIDEO_FILTERS.map((filter) => {
                      const isActive = (form.filters || []).includes(filter.param);
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => toggleFilter(filter.param)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isActive
                              ? "bg-surface-800 text-white border-surface-600"
                              : "bg-surface-900 text-surface-400 border-surface-800 hover:text-surface-200 hover:bg-surface-850"
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Video Bitrate Override"
                    placeholder="e.g. 5000k or 12M"
                    value={form.videoBitrate || ""}
                    onChange={(e) => setForm({ ...form, videoBitrate: e.target.value })}
                  />

                  <Input
                    label="Audio Bitrate"
                    placeholder="e.g. 192k"
                    value={form.audioBitrate || ""}
                    onChange={(e) => setForm({ ...form, audioBitrate: e.target.value })}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-surface-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-surface-300" />
                <span className="font-semibold text-xs text-white">Live FFmpeg Generator</span>
              </div>
              <button
                type="button"
                onClick={copyCommand}
                className="flex items-center gap-1 text-[11px] text-surface-400 hover:text-white transition-colors"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="p-3.5 bg-surface-950 rounded-xl border border-surface-800 font-mono text-xs text-surface-300 leading-relaxed break-all">
              {ffmpegCommand}
            </div>

            <div className="space-y-2 pt-2 border-t border-surface-800/80 text-xs">
              <div className="flex justify-between text-surface-400">
                <span>Container:</span>
                <span className="font-mono text-surface-200">{form.container.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-surface-400">
                <span>Video Codec:</span>
                <span className="font-mono text-surface-200">{form.videoCodec}</span>
              </div>
              <div className="flex justify-between text-surface-400">
                <span>Audio Codec:</span>
                <span className="font-mono text-surface-200">{form.audioCodec}</span>
              </div>
              <div className="flex justify-between text-surface-400">
                <span>Resolution:</span>
                <span className="font-mono text-surface-200">{form.resolution}</span>
              </div>
              <div className="flex justify-between text-surface-400">
                <span>Target CRF:</span>
                <span className="font-mono text-surface-200">{form.crf}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4"
              isLoading={isSubmitting}
            >
              <Play className="w-4 h-4 fill-current mr-1" />
              Dispatch Transcode Job
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};
