const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// ใช้ PORT ของ Render
const PORT = process.env.PORT || 3000;

/* =========================
   สร้างโฟลเดอร์ images ถ้ายังไม่มี
========================= */
const uploadPath = path.join(__dirname, "images");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

/* =========================
   ตั้งค่า multer
========================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

/* =========================
   route ทดสอบ
========================= */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* =========================
   route รับรูป
========================= */
app.post("/webhook", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  res.send("Upload success");
});

/* =========================
   เปิด server
========================= */
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
