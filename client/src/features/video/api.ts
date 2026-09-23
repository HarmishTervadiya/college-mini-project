import { apiClient } from "../../lib/api/client";
import { extractData, type SuccessEnvelope } from "../../lib/api/response";
import type { CreatedJob, UploadVideoInput } from "./types";

interface CreateJobResponse {
  jobId: string | number;
  optionsSelected: string[];
}

export async function submitVideoJob(input: UploadVideoInput): Promise<CreatedJob> {
  const formData = new FormData();
  formData.append("video", input.file);
  formData.append("options", JSON.stringify(input.operations));
  formData.append("resolution", input.resolution);
  formData.append("trimStart", String(input.trimStart));
  formData.append("trimDuration", String(input.trimDuration));
  formData.append("convertFormat", input.convertFormat);
  formData.append("watermarkText", input.watermarkText);

  const response = await apiClient.post<SuccessEnvelope<CreateJobResponse>>(
    "/api/video/upload-video",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  const data = extractData(response.data);
  return {
    jobId: String(data.jobId),
    operations: data.optionsSelected,
  };
}
