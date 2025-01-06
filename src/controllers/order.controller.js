import mongoose from "mongoose";
import Order from "../models/order.models.js";
import Product from "../models/product.models.js";

// Add a new Order
const addOrder = async (req, res) => {
    const { products } = req.body;

    try {
        // Validate product IDs
        const validProducts = await Product.find({ _id: { $in: products } });
        if (validProducts.length !== products.length) {
            return res.status(400).json({ message: "Invalid product IDs in the order" });
        }

        // Calculate total price
        const totalPrice = validProducts.reduce((sum, product) => sum + product.price, 0);

        // Create the order
        const order = await Order.create({
            user: req.user.id, // Ensure the authenticated user is associated
            products,
            totalPrice,
            status: "pending", // Default status
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

// Get all orders for the authenticated user
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("products", "name price")
            .populate("user", "name email");

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for the user" });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get a single order by ID
const getOrderWithId = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    try {
        const order = await Order.findById(id)
            .populate("products", "name price")
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: `No order found with ID: ${id}` });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

export { addOrder, getAllOrders, getOrderWithId };
