import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smartstitch/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype && file.mimetype.startsWith("image/");
  if (!isImage) {
    cb(new Error("Only image uploads are allowed."));
    return;
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
