import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const protect2 = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    // Preset password to check the token against
    const presetPassword = '$2a$04$caj.jUSpgoZXWosEbL97N.gnSte0WkumoVHmdASmfw8s4ovubwi8S';

    if (token === presetPassword) {
      // If the token matches the preset password, call next middleware
      next();
    } else {
      // If the token does not match, return an unauthorized error
      res.status(401).json({ message: 'Not authorized, token does not match preset password' });
    }
  } else {
    // If no token is provided, return an unauthorized error
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export { protect, admin, protect2 }
