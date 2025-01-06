import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
        },
        image: {
            type: String,
            required: [true, "Product image is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Reference to the User who created the product
        },
        orderItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order", // Many-to-Many relationship with orders
            },
        ],
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

export default mongoose.model('Product', ProductSchema);
