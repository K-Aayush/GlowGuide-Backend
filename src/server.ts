import express from "express";
import cors from "cors";
import "dotenv/config";
import connectCloudinary from "./config/cloudinary";
import authRoutes from "./routes/AuthRoute";
import productRoutes from "./routes/ProductRoutes";

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

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
