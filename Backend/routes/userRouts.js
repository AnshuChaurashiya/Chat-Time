const express = require('express');
const { signup, login, updateProfile } = require('../controller/User.controller');
const { ProctectRoute, CheckAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const UserRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

UserRouter.post('/signup', signup);
UserRouter.post('/login', login);
UserRouter.put('/update-profile', ProctectRoute, upload.single('profileImg'), updateProfile);
UserRouter.get('/check', ProctectRoute, CheckAuth);

module.exports = UserRouter; // Correct CommonJS export
 