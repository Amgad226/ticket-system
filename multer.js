const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./Images");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "image/jpeg") {
      cb(new Error("Only JPG images are allowed"));
    } else {
      cb(null, true);
    }
  };
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  });

  module.exports={storage,upload};