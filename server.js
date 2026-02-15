const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const LINE_TOKEN = process.env.LINE_TOKEN;
const USER_ID = process.env.USER_ID; // ใส่ใน Environment ด้วย

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

// รับรูปจาก ESP32
app.post("/webhook", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    console.log("File received:", req.file.filename);

    // URL ของรูป (Render domain ของคุณ)
    const imageUrl = `https://adn-309x.onrender.com/${req.file.path}`;

    // ส่งเข้า LINE
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: USER_ID,
        messages: [
          {
            type: "image",
            originalContentUrl: imageUrl,
            previewImageUrl: imageUrl
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LINE_TOKEN}`
        }
      }
    );

    res.status(200).send("Image received and sent to LINE");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Error sending to LINE");
  }
});

/* =========================
   เปิดให้เข้าถึงโฟลเดอร์รูป
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
