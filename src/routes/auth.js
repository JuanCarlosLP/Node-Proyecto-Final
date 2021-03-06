import express from "express";
import { signup, login, resetPassword, updatePassword } from "../controllers/auth";


const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword);

export default router;
