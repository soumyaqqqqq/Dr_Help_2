import express from 'express';
import auth from '../middleware/auth.js';
import { registerUser, loginUser, getUser, updateProfile } from '../controllers/authController.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, getUser);

// @route   PUT api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', auth, updateProfile);

export default router;
