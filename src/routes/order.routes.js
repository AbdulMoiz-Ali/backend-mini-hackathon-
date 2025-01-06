import express from "express";
import {
    addOrder,
    getAllOrders,
    getOrderWithId,
} from "../controllers/order.controller.js";
import authenticate from "../middleware/authenticate.middlewere.js";

const router = express.Router();

// Order Routes
router.post("/orders", authenticate, addOrder); 
router.get("/orders", authenticate, getAllOrders); 
router.get("/orders/:id", authenticate, getOrderWithId);

export default router;
