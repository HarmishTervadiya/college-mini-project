import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { AppError } from "./utils/AppError";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Production API is running!" });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);
export default app;