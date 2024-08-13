const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const createUploadMiddleware = (folderName) => {
  // Configure Cloudinary storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'gif'], // adjust as needed
      transformation: [{ width: 500, height: 500, crop: "limit" }] // optional
    }
  });

  return multer({
    storage: storage,
    limits: { fileSize: 2048 * 2048 }, // 2 MB limit
  }).single("file"); // file input name
};

module.exports = { createUploadMiddleware };

// // upload.js
// const multer = require("multer");
// const { nanoid } = require("nanoid");
// const path = require("path");

// const createUploadMiddleware = (folderName) => {
//   // Configure multer for file upload
//   const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//       callback(null, `./public/uploads/${folderName}`);
//     },
//     filename: (req, file, callback) => {
//       callback(null, Date.now() + nanoid(10) + path.extname(file.originalname));
//     },
//   });

//   return multer({
//     storage: storage,
//     limits: { fileSize: 2048 * 2048 }, // 1 MB limit
//   }).single("file"); // file input name
// };

// module.exports = { createUploadMiddleware };
