const uploadFile = require("../middleware/upload");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

const upload = async function (req, res) {
  try {
    await uploadFile(req, res);

    if (req.file === undefined) {
      return res.status(400).send({message: "Please upload a file."});
    }

    res.status(200).send({
      message: `File uploaded successfully: ${req.file.originalname}`
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2GB!"
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${error}`
    });
  }
};

const getFilesList = function (req, res) {
  const directoryPath = __dirname + "/../uploads";

  fs.readdir(directoryPath, function (error, files) {
    if (error) {
      res.status(500).send({ message: "Unable to scan files." });
    }

    let filesInfo = [];

    files.forEach((file) => {
      filesInfo.push({
        name: file,
        url: "http://localhost:4000/files/" + file,
      })
    })

    res.status(200).send(filesInfo);
  });
};

const downloadFile = function (req, res) {
  const fileName = req.params.name;
  const directoryPath = __dirname + "/../uploads/";

  res.download(directoryPath + fileName, fileName, (error) => {
    if (error) {
      res.status(500).send({ message: "Could not download the file." + error})
    }
  })
}

const deleteFile = async function (req, res) {
  try {
    await unlinkAsync(`${__dirname}/../uploads/file-${req.body.fileTimeStamp}.mp4`)
    res.status(202).send(`file-${req.body.fileTimeStamp}.mp4 deleted successfully`);
  } catch (error) {
    res.status(500).send({ message: `Could not delete file: file-${req.body.fileTimeStamp}.mp4`})
  }
}

module.exports = { upload, getFilesList, downloadFile, deleteFile };