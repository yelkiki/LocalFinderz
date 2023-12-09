import { Router } from "express";
import { displayAll, displayProduct, getBrands, getBrandsProducts } from "./controller/product.js";




const router = new Router();

//// test all
router.get('/displayAll',displayAll);
router.post('/display',displayProduct);
router.get('/brands',getBrands);
router.get('/brandsProducts',getBrandsProducts);






export default router;