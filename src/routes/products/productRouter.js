import { Router } from "express";
import { displayAll, displayProduct, filterSex, getBrands, getBrandsProducts, getCategory, search } from "./controller/product.js";




const router = new Router();

//// test all
router.get('/displayAll',displayAll);
router.post('/display',displayProduct);
router.get('/brands',getBrands);
router.get('/brandsProducts',getBrandsProducts);
router.get('/category',getCategory);
router.post('/search',search);
router.get('/sex',filterSex); // filter sex






export default router;