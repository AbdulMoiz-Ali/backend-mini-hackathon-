import mongoose from 'mongoose';
import { hashPassword } from '../middleware/hashPasswordMiddleware.js';


const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ["admin", "customer"],
            default: "customer",
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        // image: {
        //     type: String,
        //     required: true,
        // },
    },
    {
        timestamps: true,
    }
);

// Use save ho na sa phala hash passward ho ga phir user save ho ga 
UserSchema.pre('save', hashPassword);

export default mongoose.model('User', UserSchema);
