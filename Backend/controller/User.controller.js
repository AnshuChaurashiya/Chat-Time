const UserModel = require('../model/User.models');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils');
const cloudinary = require('../lib/CLOUDINARY');

// SIGNUP
exports.signup = async (req, res) => {
  const { fullname, email, password, bio, profileImg } = req.body;

  try {
    if (!fullname || !email || !password || !bio || !profileImg) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
      profileImg
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      userData: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        bio: newUser.bio,
        profileImg: newUser.profileImg
      },
      token,
      message: "Account created successfully",
    });

  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      userData: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        bio: user.bio,
        profileImg: user.profileImg
      },
      token,
      message: "Logged in successfully",
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// AUTH CHECK
exports.authCheck = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    res.json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        bio: user.bio,
        profileImg: user.profileImg
      },
      message: "Auth check passed",
    });
  } catch (error) {
    console.error("Auth Check Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { bio, fullname } = req.body;
    const userId = req.user._id;
    let updateData = { bio, fullname };

    // Handle image upload if present
    if (req.file) {
      try {
        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_images",
          resource_type: "auto",
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto" }
          ]
        });

        if (!uploadResponse || !uploadResponse.secure_url) {
          throw new Error('Failed to get secure URL from Cloudinary');
        }

        updateData.profileImg = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image: " + uploadError.message
        });
      }
    }

    // Update user profile
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: updateUser,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Update Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
