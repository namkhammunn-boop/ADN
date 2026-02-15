const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// สร้างโฟลเดอร์ images ถ้ายังไม่มี
const fs = require("fs");
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

// ตั้งค่า multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

// route ทดสอบ
app.get("/", (req, res) => {
  res.send("Server is running");
});

// route รับรูป
app.post("/upload", upload.single("image"), (req, res) => {
  res.send("Upload success");
});

// เปิด server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

