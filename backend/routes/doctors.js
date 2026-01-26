import express from 'express';
import auth from '../middleware/auth.js';
import {
  getDoctorProfile,
  getDoctorPatients,
  getDoctorPatientById,
  updatePatientByDoctor,
  getPatientHistoryForDoctor
} from '../controllers/doctorController.js';

const router = express.Router();

// @route   GET api/doctors/me
// @desc    Get current doctor profile
// @access  Private (doctors only)
router.get('/me', auth, getDoctorProfile);

// @route   GET api/doctors/patients
// @desc    Get all patients for a doctor
// @access  Private (doctors only)
router.get('/patients', auth, getDoctorPatients);

// @route   GET api/doctors/patients/:patientId
// @desc    Get patient details by ID
// @access  Private (doctors only)
router.get('/patients/:patientId', auth, getDoctorPatientById);

// @route   PUT api/doctors/patients/:patientId
// @desc    Update a patient's information
// @access  Private (doctors only)
router.put('/patients/:patientId', auth, updatePatientByDoctor);

// @route   GET api/doctors/patients/:patientId/history
// @desc    Get a patient's history (last 3 records of each type)
// @access  Private (doctors only)
router.get('/patients/:patientId/history', auth, getPatientHistoryForDoctor);

export default router;
