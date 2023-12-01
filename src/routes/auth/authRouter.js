import { Router } from "express";
import { Login, Register, ResetPassword, sendmail } from "../../controllers/auth.js";
import validation from "../../middleware/validation.js";
import { loginValid, mailValid, registerValid, resetValid } from "../../validations/authValidation.js";

const router = new Router();

router.post("/login",validation(loginValid),Login);
router.post("/signup",validation(registerValid),Register);
router.post("/sendmail",validation(mailValid),sendmail);
router.post("/reset/:token",validation(resetValid),ResetPassword);




export default router;