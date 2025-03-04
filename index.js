import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/db/index.js";
import cors from "cors";
import userroutes from "./src/routes/auth.routes.js";
import productroutes from "./src/routes/product.routers.js";
import orderroutes from "./src/routes/order.routes.js";
import cookieParser from "cookie-parser";
// Swagger imports
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js"; // Make sure swagger.js has a default export

// Fix EventEmitter max listeners warning
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/auth", userroutes);
app.use("/product", productroutes);
app.use("/order", orderroutes);

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
            console.log(`Swagger Docs available at http://localhost:${process.env.PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    });
