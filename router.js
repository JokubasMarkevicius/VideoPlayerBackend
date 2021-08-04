const express = require("express");

const videoController = require('./controllers/videoController')

const router = express.Router();

router.post("/upload", videoController.upload);
router.get("/files", videoController.getFilesList);
router.get("/files/:name", videoController.downloadFile);

module.exports = router;