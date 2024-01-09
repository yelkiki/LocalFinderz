import { Router } from "express";
import { displayAll, displayProduct, filter, filterSex, getBrands, getBrandsProducts, getCategory, search, searchBrand } from "./controller/product.js";
import { authentication } from "../../middleware/authentication.js";




const router = new Router();

//// test all
router.get('/displayAll',displayAll);
router.post('/display',displayProduct);
router.get('/brands',getBrands);
router.get('/brandsProducts',getBrandsProducts);
router.post('/category',getCategory);
router.post('/search',search);
router.post('/searchBrand',searchBrand);
router.get('/sex',filterSex);
router.get('/filter',filter);






export default router;