import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// ✅ Only use CORS globally
app.use(cors());

// ✅ Mount the multipart/form-data route FIRST
app.use("/api/product", productRouter);

// ✅ Then use JSON body parsers (for non-file routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Other routes
app.use("/api/user", userRouter);

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(port, () => console.log(`Server running on ${port}`));
