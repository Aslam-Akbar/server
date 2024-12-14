const express = require("express");
const cors = require("cors"); // Importing CORS middleware
const multer = require("multer"); // Importing Multer for file handling
const path = require("path");
const fs = require("fs"); // File system module to manage directories
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());
const uploadDir = ".../public/uploads/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage to preserve file extensions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads/images")); // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Initialize Multer with the custom storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB file size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File must be an image!"), false);
    }
  },
});

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // Respond with the file path after upload
  res.send({
    message: "File uploaded successfully!",
    file: req.file.filename,
    path: `/images/${req.file.filename}`, // Static access URL
  });
});

// Serve uploaded images statically
app.use("/images", express.static(path.join(__dirname, uploadDir)));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
