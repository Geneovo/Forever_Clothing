import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/productModel.js';

// Function for add product
// const addProduct = async (req, res) => {
//     try {
       
//         const { name, description, price, category, subCategory, sizes, bestseller } = req.body
//         console.log(req)

//         const image1 = req.files.image1 && req.files.image1[0]
//         const image2 = req.files.image2 && req.files.image2[0]
//         const image3 = req.files.image3 && req.files.image3[0]
//         const image4 = req.files.image4 && req.files.image4[0]

//         // const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

//         // let imagesUrl = await Promise.all(
//         //     images.map(async (item) => {
//         //         let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
//         //         return result.secure_url
//         //     })
//         // )

//         console.log(name, description, price, category, subCategory, sizes, bestseller)
//         // console.log(imagesUrl)
//         console.log(image1, image2, image3, image4)


//         res.json({})
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// const addProduct = async (req, res) => {
//     console.log("Calling addProduct");
//     const {
//         name,
//         description,
//         price,
//         category,
//         subCategory,
//         sizes,
//         bestseller,
//         images,
//       } = req.body;

//       try {
//         if (!images || !Array.isArray(images) || images.length === 0) {
//           return res.status(400).json({ success: false, message: "At least one image is required" });
//         }
    
//         // Upload each image to Cloudinary
//         const uploadedImages = await Promise.all(
//           images.map((img) =>
//             cloudinary.uploader.upload(img, { folder: "products" })
//           )
//         );
    
//         // Get the secure URLs
//         const imageUrls = uploadedImages.map((result) => result.secure_url);
    
//         const product = await Product.create({
//           name,
//           description,
//           price,
//           category,
//           subCategory,
//           sizes,
//           bestseller,
//           image: imageUrls // Save array of image URLs
//         });
    
//         res.status(201).json({ success: true, product });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: error.message });
//       }
// };
  

// Function for list product

const addProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body);  // Log req.body
    console.log("Request Files:", req.files); // Log req.files

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
      price,
      category,
      subCategory,
      sizes: sizes.split(','), // Convert comma-separated sizes string to an array
      bestseller: bestseller === 'true',
      image: imageUrls
    });

    // Save to DB
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};


const listProduct = async (req, res) => {
    
}

// Function for removing product
const removeProduct = async (req, res) => {
    
}

// Function for single product info
const singleProduct = async (req, res) => {
    
}

export { addProduct, listProduct, removeProduct, singleProduct }