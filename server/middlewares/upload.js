// upload.js
const multer = require("multer");
const { nanoid } = require("nanoid");
const path = require("path");

const createUploadMiddleware = (folderName) => {
  // Configure multer for file upload
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, `./public/uploads/${folderName}`);
    },
    filename: (req, file, callback) => {
      callback(null, Date.now() + nanoid(10) + path.extname(file.originalname));
    },
  });

  return multer({
    storage: storage,
    limits: { fileSize: 2048 * 2048 }, // 1 MB limit
  }).single("file"); // file input name
};

module.exports = { createUploadMiddleware };
