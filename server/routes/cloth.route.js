import express from "express";
import auth from "../middlewares/auth.middleware.js";
import clothController from "../controllers/cloth.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", clothController.getAllClothes);
router.get("/meta", clothController.getShopMeta);
router.get("/:id", clothController.getClothById);

// ADMIN ONLY – (simple admin token check)
router.post("/", auth.authAdmin, upload.array("images", 6), clothController.createCloth);
router.patch("/:id", auth.authAdmin, clothController.updateCloth);
router.delete("/:id", auth.authAdmin, clothController.deleteCloth);

export default router;
