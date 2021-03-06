import express from "express";
import {getAll} from "../controllers/users";
import {isAdmin, isEditor, isUser} from "../middlewares/roleAuth";
const router = express.Router();

router.get("/contents", isUser(5), getAll);

export default router;