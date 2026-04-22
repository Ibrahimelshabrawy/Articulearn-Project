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
    if (!custom_types.includes(file.mimetype)) {
      return cb(new Error("inValid File Type", {cause: 400}));
    }
    return cb(null, true);
  }

  const upload = multer({storage, fileFilter});
  return upload;
};

export default multer_host;
