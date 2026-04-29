import fs from "fs";
import path from "path";
import multer from "multer";

const multer_host = (custom_types = []) => {
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    const allowedExt = [".wav", ".mp3", ".m4a"];

    const ext = path.extname(file.originalname).toLowerCase();

    if (custom_types.includes(file.mimetype) || allowedExt.includes(ext)) {
      return cb(null, true);
    }

    return cb(new Error("Invalid File Type", {cause: 400}));
  }

  const upload = multer({storage, fileFilter});
  return upload;
};

export default multer_host;
