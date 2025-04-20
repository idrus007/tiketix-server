// src/config/uploadImage.ts
import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // Menyimpan file di folder 'uploads'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filter untuk jenis file yang diterima
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Terima file jika tipe MIME sesuai
  } else {
    // Explicitly casting error to ensure correct type handling
    const error: Error = new Error(
      "Invalid file type. Only JPEG, PNG, and GIF are allowed."
    );
    error.name = "MulterError";
    error.message = "Invalid file type. Only JPEG, PNG, and GIF are allowed.";
    cb(error); // Tolak file jika tipe MIME tidak sesuai
  }
};

// Inisialisasi Multer dengan konfigurasi
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal ukuran file 10MB
  fileFilter: fileFilter,
});

export default upload;
