import { Router } from "express";
import { Login, Register } from "../../controllers/auth.js";
import validation from "../../middleware/validation.js";
import { loginValid, registerValid } from "../../validations/authValidation.js";

const router = new Router();

router.post("/login",validation(loginValid),Login);
router.post("/signup",validation(registerValid),Register);




export default router;