import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import connectCloudinary from "./config/cloudinary";
import authRoutes from "./routes/AuthRoutes";
import productRoutes from "./routes/ProductRoutes";
import dermotologistRoutes from "./routes/dermotologistRoutes";
import progressRoutes from "./routes/ProgressRoutes";
import routineRoutes from "./routes/RoutineRoutes";
import skinProfileRoutes from "./routes/SkinProfileRoutes";
import adminRoutes from "./routes/AdminRoutes";
import chatRoutes from "./routes/ChatRoutes";
import appointmentRoutes from "./routes/AppointmentRoutes";
import notificationRoutes from "./routes/NotificationRoutes";
import aiRoutes from "./routes/AIRoutes";
import { setupSocketHandlers } from "./socket/socketHandlers";

// Initialize express
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Setup socket handlers
setupSocketHandlers(io);

(async () => {
  await connectCloudinary();
})();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dermotologist", dermotologistRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/skinProfile", skinProfileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 9000;

httpServer.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
