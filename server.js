const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   ตั้งค่าโฟลเดอร์เก็บไฟล์
========================= */
const uploadFolder = "uploads";

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

/* =========================
   Routes
========================= */

// หน้าแรก
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ทดสอบผ่าน browser
app.get("/webhook", (req, res) => {
  res.send("Webhook endpoint ready (POST only)");
});

// รับรูปจาก ESP32
app.post("/webhook", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  console.log("File received:", req.file.filename);
  res.status(200).send("Image received successfully");
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
