import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { processVideo } from "./video.service";

export const uploadVideo = catchAsync(async (req: Request, res: Response) => {
  console.log(`[API] Received file upload request`);
  
  const result = await processVideo({
    file: req.file as Express.Multer.File,
    ...req.body
  });

  res.status(200).json({
    status: "success",
    message: "Video upload success. Job queued.",
    data: result
  });
});
