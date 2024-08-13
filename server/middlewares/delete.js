const cloudinary = require("cloudinary").v2;

const createDeleteMiddleware = () => {
  return async (req, res, next) => {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({ error: "Missing public_id" });
    }

    try {
      // Delete the file from Cloudinary
      const result = await cloudinary.uploader.destroy(public_id);

      if (result.result === 'ok') {
        next();
      } else {
        return res.status(500).json({ error: "Failed to delete the file from Cloudinary" });
      }
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
      return res.status(500).json({ error: "Failed to delete the file", details: error.message });
    }
  };
};

module.exports = { createDeleteMiddleware };

// const fs = require('fs').promises;
// const path = require('path');

// const createDeleteMiddleware = (folderName, fileName) => {
//   return async (req, res, next) => {
//     const { folderName, fileName } = req.params;

//     if (!fileName) {
//       return res.status(400).json({ error: "Missing filename" });
//     }

//     try {
//       const filePath = path.join(__dirname, '..', 'public', 'uploads', folderName, fileName);

//       // Check if the file exists before attempting to delete
//       await fs.access(filePath);

//       // Delete the file
//       await fs.unlink(filePath);

//       // File deleted successfully, pass control to the next middleware or route handler
//       next();
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       if (error.code === 'ENOENT') {
//         // File doesn't exist, consider it already deleted
//         console.log(`File not found, considered deleted. Don't need to worry about this error.`);
//         res.status(200).json({ message: 'File considered deleted' });
//       } else {
//         return res.status(500).json({ error: "Failed to delete the file", details: error.message });
//       }
//     }
//   };
// };

// module.exports = { createDeleteMiddleware };