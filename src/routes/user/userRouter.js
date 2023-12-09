import { Router } from "express";
import { authentication } from "../../middleware/authentication.js";
import { displayInfo } from "./controller/user.js";

const router = new Router();

//// hena el endpoints

router.get('/userInfo',authentication(),displayInfo);



export default router;