import { Router } from "express";
import { authentication } from "../../middleware/authentication.js";
import { displayInfo, orderHistory } from "./controller/user.js";

const router = new Router();

//// hena el endpoints

router.get('/userInfo',authentication(),displayInfo);
router.get('/orderHistory',authentication(),orderHistory);



export default router;