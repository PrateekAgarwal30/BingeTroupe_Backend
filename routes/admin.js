const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("./../controllers/adminController");

const contentFileFilter = function(req, file, cb) {
  cb(null, file.mimetype === "image/png" || file.mimetype === "image/jpeg");
};
const contentUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //   fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  // },
  // fileFilter: contentFileFilter
});

router.post(
  "/content",
  contentUploadMiddleware.fields([{ name: 'contentImage', maxCount: 1 }, { name: 'contentVideo', maxCount: 1 }]),
  adminController.postNewContent
);

module.exports = router;