import { Router } from "express";
import { authentication, authorization } from "../../middleware/authentication.js";
import { addBrand, addProduct, deleteUser, removeBrand, removeProduct, updateProduct } from "../../controllers/admin.js";

const router = new Router();
/// kol el routes na2sa validation
router.post("/addProduct",authentication(),authorization(),addProduct);
router.post("/addBrand",authentication(),authorization(),addBrand);
router.delete("/removeProduct/:id",authentication(),authorization(),removeProduct);
router.delete("/removeBrand",authentication(),authorization(),removeBrand);
router.post("/UpdateQuantity/:id",authentication(),authorization(),updateProduct);
router.delete("/DeleteUser",authentication(),authorization(),deleteUser);




export default router;