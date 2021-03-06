import express from "express";

const router = express.Router();

router.get("/roles");
router.get("/roles/:id");
router.post("/roles");
router.put("/roles");
router.delete("/roles/:id");

export default router;
