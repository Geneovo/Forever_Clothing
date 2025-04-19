import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: [String], // Just store the image URLs (from Cloudinary)
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    sizes: {
        type: [String],
        required: true
    },
    date: {
        type: Number,
        default: Date.now
    },
    bestseller: {
        type: Boolean,
        default: false
    }
});

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;