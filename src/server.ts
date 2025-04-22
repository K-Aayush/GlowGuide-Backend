import express from "express";
import cors from "cors";
import "dotenv/config";
import connectCloudinary from "./config/cloudinary";
import authRoutes from "./routes/AuthRoutes";
import productRoutes from "./routes/ProductRoutes";
import dermotologistRoutes from "./routes/dermotologistRoutes";
import progressRoutes from "./routes/ProgressRoutes";
import routineRoutes from "./routes/RoutineRoutes";
import skinProfileRoutes from "./routes/SkinProfileRoutes";

//initialize express
const app = express();

(async () => {
  await connectCloudinary();
})();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dermotologist", dermotologistRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/skinProfile", skinProfileRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
