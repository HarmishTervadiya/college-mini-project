import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadVideo } from "./video.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { uploadVideoSchema } from "./video.schema";

const router = Router();

const uploadsDir = path.join(__dirname, "../../../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

router.post(
  "/upload-video",
  upload.single("video"),
  validateRequest(uploadVideoSchema),
  uploadVideo
);

export const videoRoutes = router;
