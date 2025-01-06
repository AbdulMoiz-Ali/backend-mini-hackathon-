import express from "express";
import { 
    addProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from "../controllers/products.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import authenticate from "../middleware/authenticate.middlewere.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/addproducts", authenticate, upload.single("image"), addProduct);
router.put("/addproducts/:id", authenticate, upload.single("image"), updateProduct);
router.delete("/deleteproducts/:id", authenticate, deleteProduct);

export default router;
