import { Router } from "express";
import { authentication } from "../../middleware/authentication.js";
import { orderDetails, placeOrder } from "./controller/order.js";


const router = new Router();


router.post('/place',authentication(),placeOrder)
router.post('/details',authentication(),orderDetails)


export default router;