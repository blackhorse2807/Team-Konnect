const mongoose = require('mongoose');

// Define the Mongoose schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: String,
        trim: true,
    },
    subCategory: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: false,
    },
    discount: {
        type: String,
        required: false,
    },
    rating: {
        type: Number,
        required: false,
    },
    reviewsCount: {
        type: Number,
        required: false,
    },
    productUrl: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;