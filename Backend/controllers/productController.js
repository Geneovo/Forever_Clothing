import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/productModel.js';

// Function to add products
const addProduct = async (req, res) => {
  try {
    // console.log("Request Body:", req.body);  // Log req.body
    // console.log("Request Files:", req.files); // Log req.files

    // Only proceed if both req.body and req.files are populated
    if (!req.body || !req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Bad request, missing fields or files" });
    }

    // Destructure product data from req.body
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
    const images = req.files;

    // Validate the necessary fields
    if (!name || !description || !price || !category || !subCategory) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Upload images to Cloudinary and get secure URLs
    const imageUrls = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imageUrls.push(result.secure_url);
    }

    // Create a new product object
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === 'true' ? true : false,
      image: imageUrls,
      date: Date.now()
    });

    console.log("New Product:", newProduct);

    // Save to DB
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};


// Function to list all products
const listProduct = async (req, res) => {
    
  try {

    const products = await Product.find({}).sort({date: -1})
    res.json({success: true, products})

  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ success: false, message: "Error listing products", error: error.message });
  }
}

// Function for removing product
const removeProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
      console.error("Error removing product:", error);
      res.status(500).json({ success: false, message: "Error removing product", error: error.message });
    }
}

// Function for single product info
const singleProduct = async (req, res) => {
    try {
      const { productId } = req.body;
      const product = await Product.findById(productId);
      res.json({ success: true, product });
    } catch (error) {
        console.error("Error listing products:", error);
        res.status(500).json({ success: false, message: "Error listing products", error: error.message });
    }
}

export { addProduct, listProduct, removeProduct, singleProduct }