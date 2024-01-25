const express = require("express");
const cors = require("cors");
const fs = require("fs");
var path = require("path")
require("dotenv").config();

const app = express();
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (_req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "public/uploads/"),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Speficies where file should be stored
const uploads = multer({ storage: storage });

/**
 * Displays the new name of the file
 * @callback {function} cb
 * @param {*} req - The Request object
 * @param {*} res - The Response object
 * @param {cb} next - The next middleware function
 * @api {post} /api/uploaded - Upload a single file
 */
function displayName(req, res, next) {
  res.send(req.file.originalname + " was saved as " + req.file.filename + "!");
  next();
}

app.post("/api/uploaded", uploads.single("upfile"), displayName);

app.listen(3000, () => {
  console.log("Your app is listening on port 3000");
});

app.get("/images/:image", (req, res) => {
  const fp = process.cwd() + "/public/uploads/" + req.params.image;

  if (fs.existsSync(fp)) {
    res.sendFile(fp);
  } else {
    res.sendStatus(404);
  }
});