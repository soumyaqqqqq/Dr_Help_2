import express from 'express';
import auth from '../middleware/auth.js';
import {
  getPatientProfile,
  addPainScore,
  addTemperature,
  addVitals,
  getAlerts,
  getPatientHistory,
  markAlertRead
} from '../controllers/patientController.js';

const router = express.Router();

// @route   GET api/patients/me
// @desc    Get current patient profile
// @access  Private (patients only)
router.get('/me', auth, getPatientProfile);

// @route   POST api/patients/pain-scores
// @desc    Add a pain score record
// @access  Private (patients only)
router.post('/pain-scores', auth, addPainScore);

// @route   POST api/patients/temperature
// @desc    Add a new temperature record
// @access  Private (patients only)
router.post('/temperature', auth, addTemperature);

// @route   POST api/patients/vitals
// @desc    Add a new vitals record
// @access  Private (patients only)
router.post('/vitals', auth, addVitals);

// @route   GET api/patients/alerts
// @desc    Get all alerts for a patient
// @access  Private (patients only)
router.get('/alerts', auth, getAlerts);

// @route   GET api/patients/history
// @desc    Get patient history (last 3 records of each type)
// @access  Private (patients only)
router.get('/history', auth, getPatientHistory);

// @route   PUT api/patients/alerts/:alertId
// @desc    Mark an alert as read
// @access  Private (patients only)
router.put('/alerts/:alertId', auth, markAlertRead);

export default router;
