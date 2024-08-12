const fs = require('fs').promises;
const path = require('path');

const createDeleteMiddleware = (folderName, fileName) => {
  return async (req, res, next) => {
    const { folderName, fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ error: "Missing filename" });
    }

    try {
      const filePath = path.join(__dirname, '..', 'public', 'uploads', folderName, fileName);

      // Check if the file exists before attempting to delete
      await fs.access(filePath);

      // Delete the file
      await fs.unlink(filePath);

      // File deleted successfully, pass control to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error deleting file:", error);
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: "File not found" });
      } else {
        return res.status(500).json({ error: "Failed to delete the file", details: error.message });
      }
    }
  };
};

module.exports = { createDeleteMiddleware };