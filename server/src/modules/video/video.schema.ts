import { z } from "zod";
import { config } from "../../config";

export const uploadVideoSchema = z.object({
  body: z.object({
    options: z.union([
      z.string(), // Because of FormData, arrays often come as comma-separated strings or string arrays
      z.array(z.string()),
    ]).optional(),
    resolution: z.string().optional().default(config.constants.VIDEO.DEFAULT_RESOLUTION),
    trimStart: z.coerce.number().optional().default(config.constants.VIDEO.DEFAULT_TRIM_START),
    trimDuration: z.coerce.number().optional().default(config.constants.VIDEO.DEFAULT_TRIM_DURATION),
    convertFormat: z.string().optional().default(config.constants.VIDEO.DEFAULT_CONVERT_FORMAT),
    watermarkText: z.string().optional().default(config.constants.VIDEO.DEFAULT_WATERMARK_TEXT),
  }),
});
