import express from "express";
import {getAll} from "../controllers/users";
import jwtValidate from "express-jwt";

const optionsJWT = { secret: process.env.SECRET_KEY, algorithms: ["HS256"] };
const router = express.Router();

router.get("/users", jwtValidate(optionsJWT), getAll);
router.get("/users/:id");
router.post("/users");
router.put("/users/:id");
router.delete("/users/:id");


export default router;