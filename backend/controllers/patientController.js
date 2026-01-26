import Patient from '../models/Patient.js';
import User from '../models/User.js';

// @desc    Get all patients
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('userId', ['name', 'email']);

        // Transform data to ensure name is available at top level if needed by frontend
        const formattedPatients = patients.map(patient => {
            const patientObj = patient.toObject();
            if (patient.userId && patient.userId.name) {
                patientObj.name = patient.userId.name;
            }
            return patientObj;
        });

        res.json(formattedPatients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get current patient profile
export const getPatientProfile = async (req, res) => {
    try {
        // Check if user is a patient
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'patient') {
            return res.status(401).json({ msg: 'Not authorized as a patient' });
        }

        const patient = await Patient.findOne({ userId: req.user.id })
            .populate('userId', ['name', 'email'])
            .populate('doctorId', 'specialty');

        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Add a pain score record
export const addPainScore = async (req, res) => {
    const { score, notes } = req.body;

    // Validate input
    if (score < 0 || score > 10) {
        return res.status(400).json({ msg: 'Score must be between 0 and 10' });
    }

    try {
        // Check if user is a patient
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'patient') {
            return res.status(401).json({ msg: 'Not authorized as a patient' });
        }

        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        // Add new pain score (will be limited to last 3 by pre-save hook)
        patient.painScores.push({
            score,
            notes,
            timestamp: Date.now()
        });

        await patient.save();

        res.json(patient.painScores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Add a new temperature record
export const addTemperature = async (req, res) => {
    const { value } = req.body;

    try {
        // Check if user is a patient
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'patient') {
            return res.status(401).json({ msg: 'Not authorized as a patient' });
        }

        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        // Initialize temperatures array if it doesn't exist
        if (!patient.temperatures) {
            patient.temperatures = [];
        }

        // Add new temperature (will be limited to last 3 by pre-save hook)
        patient.temperatures.push({
            value,
            timestamp: Date.now()
        });

        // Update current vitals temperature
        patient.vitals.temperature = value;
        patient.vitals.updatedAt = Date.now();

        await patient.save();

        res.json(patient.temperatures);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Add a new vitals record
export const addVitals = async (req, res) => {
    const { heartRate, bloodPressure } = req.body;

    try {
        // Check if user is a patient
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'patient') {
            return res.status(401).json({ msg: 'Not authorized as a patient' });
        }

        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        // Initialize vitalsHistory array if it doesn't exist
        if (!patient.vitalsHistory) {
            patient.vitalsHistory = [];
        }

        // Add new vitals record (will be limited to last 3 by pre-save hook)
        patient.vitalsHistory.push({
            heartRate,
            bloodPressure,
            timestamp: Date.now()
        });

        // Update current vitals
        patient.vitals.heartRate = heartRate;
        patient.vitals.bloodPressure = bloodPressure;
        patient.vitals.updatedAt = Date.now();

        await patient.save();

        res.json(patient.vitalsHistory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all alerts for a patient
export const getAlerts = async (req, res) => {
    try {
        // Check if user is a patient
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'patient') {
            return res.status(401).json({ msg: 'Not authorized as a patient' });
        }

        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        res.json(patient.alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get patient history (last 3 records of each type)
export const getPatientHistory = async (req, res) => {
    try {
        // Check if user is a patient
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'patient') {
            return res.status(401).json({ msg: 'Not authorized as a patient' });
        }

        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        // Get last 3 records of each type
        const history = {
            painScores: patient.painScores || [],
            temperatures: patient.temperatures || [],
            vitals: patient.vitalsHistory || []
        };

        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Mark an alert as read
export const markAlertRead = async (req, res) => {
    try {
        // Check if user is a patient
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'patient') {
            return res.status(401).json({ msg: 'Not authorized as a patient' });
        }

        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient profile not found' });
        }

        // Find alert by ID
        const alertIndex = patient.alerts.findIndex(
            alert => alert._id.toString() === req.params.alertId
        );

        if (alertIndex === -1) {
            return res.status(404).json({ msg: 'Alert not found' });
        }

        // Mark as read
        patient.alerts[alertIndex].isRead = true;

        await patient.save();

        res.json(patient.alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
