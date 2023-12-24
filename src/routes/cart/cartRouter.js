import { Router } from "express";
import { add2cart, decQuant, displayCart, removeFromCart } from "./controller/cart.js";
import { authentication } from "../../middleware/authentication.js";

const router = new Router();



router.get('/',authentication(),displayCart);
router.post('/add/:id',authentication(),add2cart);
router.post('/remove/:id',authentication(),removeFromCart);
router.post('/dec/:id',authentication(),decQuant);


export default router;