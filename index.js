import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/db/index.js";
import cors from "cors"
import userroutes from "./src/routes/auth.routes.js"
import productroutes from "./src/routes/product.routers.js"
import orderroutes from "./src/routes/order.routes.js"
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// routes   
app.use("/auth", userroutes);
app.use("/product", productroutes);
app.use("/order", orderroutes);

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    });