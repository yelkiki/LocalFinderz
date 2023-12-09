import { Router } from "express";
import { Login, Register, ResetPassword, VerifyToken, sendmail } from "./controller/auth.js";
import validation from "../../middleware/validation.js";
import { loginValid, mailValid, registerValid, resetValid, tokenValid } from "./controller/authValidation.js";

const router = new Router();

router.post("/login",validation(loginValid),Login);
router.post("/signup",validation(registerValid),Register);
router.post("/sendmail",validation(mailValid),sendmail);
router.post("/verifyToken",validation(tokenValid),VerifyToken); // returns user id then reset password
router.post("/changePass",validation(resetValid),ResetPassword); // id w new password --> id men data bta3et verify token if successful




export default router;