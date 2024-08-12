// certificate.js
const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/auth");
const { createUploadMiddleware } = require("../middlewares/upload");

router.post("/upload/:folderName", validateToken, (req, res, next) => {
  const { folderName } = req.params;
  const upload = createUploadMiddleware(folderName); // Create middleware with folderName

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ filename: req.file.filename });
  });
});

module.exports = router;
