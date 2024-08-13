const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/auth");
const { createUploadMiddleware } = require("../middlewares/upload");
const { createDeleteMiddleware } = require("../middlewares/delete");

router.post("/upload/:folderName", validateToken, (req, res, next) => {
  const { folderName } = req.params;
  const upload = createUploadMiddleware(folderName);

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ 
      public_id: req.file.public_id,
      url: req.file.url
    });
  });
});

router.delete(
  "/delete/:public_id",
  validateToken,
  createDeleteMiddleware(),
  (req, res) => {
    res.json({ message: "File deleted successfully" });
  }
);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { validateToken } = require("../middlewares/auth");
// const { createUploadMiddleware } = require("../middlewares/upload");
// const { createDeleteMiddleware } = require("../middlewares/delete");

// router.post("/upload/:folderName", validateToken, (req, res, next) => {
//   const { folderName } = req.params;
//   const upload = createUploadMiddleware(folderName);

//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     res.json({ filename: req.file.filename });
//   });
// });

// router.delete(
//   "/delete/folder/:folderName/file/:fileName",
//   validateToken,
//   (req, res, next) => {
//     const { folderName, fileName } = req.params;
//     const deleteFile = createDeleteMiddleware(folderName, fileName);
//     deleteFile(req, res, () => {
//       res.json({ message: "File deleted successfully" });
//     });
//   }
// );

// module.exports = router;