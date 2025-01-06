import mongoose from "mongoose";
import Product from "../models/product.models.js"; 
import cloudinary from "../middleware/cloudinary.js";

// Helper function to upload image
const uploadImageToCloudinary = async (localPath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(localPath, { resource_type: "image" });
        return uploadResult.url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

// Add a new product
const addProduct = async (req, res) => {
    const { name, description, price } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "Product must include an image" });
    }

    try {
        const imageUrl = await uploadImageToCloudinary(req.file.path);

        if (!imageUrl) {
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            image: imageUrl,
            user: req.user.id, // Set the user who created the product
        });

        res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

// Get all products with pagination
const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("user", "name email");

        const totalProducts = await Product.countDocuments();
        res.status(200).json({
            success: true,
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products" });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }

    try {
        const product = await Product.findById(id).populate("user", "name email");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching product" });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own products" });
        }

        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(req.file.path);
            if (imageUrl) product.image = imageUrl;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product" });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own products" });
        }

        await product.deleteOne();
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product" });
    }
};

export { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
