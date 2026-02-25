import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = process.env.UPLOAD_PATH || "uploads";

const ensureUploadDir = () => {
  const fullPath = path.join(process.cwd(), uploadDir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fullPath = ensureUploadDir();
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${timestamp}-${safeName}`);
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
