import express from "express";
import auth from "../middlewares/auth.middleware.js";
import clothController from "../controllers/cloth.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Wrapper to catch multer/cloudinary upload errors
const handleUpload = (req, res, next) => {
    upload.array("images", 6)(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(500).json({ message: `Image upload failed: ${err.message}` });
        }
        next();
    });
};

// PUBLIC
router.get("/", clothController.getAllClothes);
router.get("/meta", clothController.getShopMeta);
router.get("/:id", clothController.getClothById);

// ADMIN ONLY – (simple admin token check)
router.post("/", auth.authAdmin, handleUpload, clothController.createCloth);
router.patch("/:id", auth.authAdmin, clothController.updateCloth);
router.delete("/:id", auth.authAdmin, clothController.deleteCloth);

export default router;
