import express from "express";
import {
    addOrder,
    getAllOrders,
    getOrderWithId,
} from "../controllers/order.controller.js";
import authenticate from "../middleware/authenticate.middlewere.js";

const router = express.Router();

/**
 * @swagger
 * /order/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Array of product IDs
 *             example:
 *               products: ["63f1b2c10f1c5a5a8d7a69b1", "63f1b2c10f1c5a5a8d7a69b2"]
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created order
 *                 products:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of product IDs in the order
 *                 totalPrice:
 *                   type: number
 *                   description: Total price of the order
 *                 status:
 *                   type: string
 *                   description: Status of the order
 *                   example: pending
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/orders", authenticate, addOrder);

/**
 * @swagger
 * /order/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Order ID
 *                   products:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of product IDs in the order
 *                   totalPrice:
 *                     type: number
 *                     description: Total price of the order
 *                   status:
 *                     type: string
 *                     description: Status of the order
 *                   orderDate:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the order was placed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/orders", authenticate, getAllOrders);

/**
 * @swagger
 * /order/orders/{id}:
 *   get:
 *     summary: Get details of a single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Order ID
 *                 products:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: List of product IDs in the order
 *                 totalPrice:
 *                   type: number
 *                   description: Total price of the order
 *                 status:
 *                   type: string
 *                   description: Status of the order
 *                   example: pending
 *                 orderDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the order was placed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get("/orders/:id", authenticate, getOrderWithId);

export default router;
