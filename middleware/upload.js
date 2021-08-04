const { promisify } = require("util");
const { extname } = require("path");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../uploads");
  },
  filename: (req, file, cb) => {
    console.log(`${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
    cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: {fileSize: maxSize}
}).single("file");

let uploadFileMiddleware = promisify(uploadFile);
module.exports = uploadFileMiddleware;