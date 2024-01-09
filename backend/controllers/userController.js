import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { alpID } = req.body;

  const user = await User.findOne({ alpID });

  if (!user) {
    res.status(401);
    throw new Error("Invalid ALP number");
  }

  if (!(await user.matchPassword(alpID))) {
    res.status(401);
    throw new Error("Invalid ALP number");
  }
  // Check for existing order with the user's SID
  // const existingOrder = await Order.findOne({ sid: user.sid });
  // if (existingOrder) {
  //   res.status(401);
  //   throw new Error("Login failed: existing order found for user.");
  // }

  res.json({
    _id: user._id,
    alpID: user.alpID,
    sid: user.sid,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
    rand: user.rand,
    servicesPermutation: user.servicesPermutation,
    itemOrder: user.itemOrder,
    isControl: user.isControl,
    checkoutItems: user.checkoutItems
  });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { alpID, sid } = req.body;

  const userExists = await User.findOne({ alpID });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    alpID: alpID,
    sid: sid,
    password: alpID,
  });


  if (user) {
    res.status(201).json({
      _id: user._id,
      alpID: user.alpID,
      sid: user.sid,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      rand: user.rand,
      servicesPermutation: user.servicesPermutation,
      itemOrder: user.itemOrder,
      isControl: user.isControl,
      checkoutItems: user.checkoutItems
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      alpID: user.alpID,
      sid: user.sid,
      isAdmin: user.isAdmin,
      rand: user.rand,
      servicesPermutation: user.servicesPermutation,
      itemOrder: user.itemOrder,
      isControl: user.isControl,
      checkoutItems: user.checkoutItems
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.alpID = req.body.alpID || user.alpID;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      alpID: updatedUser.alpID,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.alpID = req.body.alpID || user.alpID;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      alpID: updatedUser.alpID,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
