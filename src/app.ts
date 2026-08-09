import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import activityRoutes from "./routes/activity.routes";
import studentRoutes from "./routes/student.routes";
import activityTemplateRoutes from "./routes/activityTemplateRoutes";
import lessonRoutes from "./routes/lesson.routes";


const app = express();

// Security
app.use(helmet());

// Enable CORS

app.use(cors({
  origin:["http://localhost:3000","https://futurecubs-frontend-zmzo.vercel.app",] ,
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Compress Responses
app.use(compression());

// Logger
app.use(morgan("dev"));

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FutureCubs Backend Running 🚀",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/students", studentRoutes);  
app.use("/api/activity-templates", activityTemplateRoutes);
app.use("/api/lessons", lessonRoutes);
export default app;