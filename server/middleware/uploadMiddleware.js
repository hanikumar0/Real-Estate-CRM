import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Define flags
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;
const hasCloudinary = !!(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_KEY);
const useCloud = isVercel || hasCloudinary;

// Cloudinary Configuration
if (hasCloudinary && !process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// 1. Cloudinary Storage (For Production/Vercel)
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'estateflow-crm',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
    public_id: (req, file) => `file-${Date.now()}`
  }
});

// 2. Disk Storage (For Local Dev only)
const uploadDir = 'uploads/';
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Only try to create folder if we are actually using disk storage (Local)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Format not supported'));
};

// Export the middleware
export const upload = multer({
  storage: useCloud ? cloudStorage : diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});
