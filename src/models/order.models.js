import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Reference to the User who placed the order
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true, // Array of product references
            },
        ],
        totalPrice: {
            type: Number,
            required: true, // Total price of the order
        },
        status: {
            type: String,
            enum: ["pending", "completed", "shipped"],
            default: "pending", // Default status
        },
        orderDate: {
            type: Date,
            default: Date.now, // Automatically set the order date
        },
    },
    {
        timestamps: true, // Manage `createdAt` and `updatedAt` timestamps
    }
);

export default mongoose.model('Order', OrderSchema);
