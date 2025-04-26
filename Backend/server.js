import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/ordersRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// ✅ Only use CORS globally
app.use(cors());

// ✅ First use the JSON body parser before mounting the routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Health check
app.get("/", (req, res) => {
  res.send("APIs are running");
});

app.listen(port, () => console.log(`Server running on ${port}`));
