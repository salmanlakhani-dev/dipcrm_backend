const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
