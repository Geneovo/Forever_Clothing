import express from "express";
import { addProduct, listProduct, removeProduct, singleProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.post('/add', upload.array('images', 4), addProduct);
productRouter.get("/list", listProduct);
productRouter.post("/single", singleProduct);
productRouter.post("/remove", removeProduct);

export default productRouter;
