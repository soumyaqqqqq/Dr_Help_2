import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';

// @desc    Get all doctors
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('userId', ['name', 'email']);
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get current doctor profile
export const getDoctorProfile = async (req, res) => {
    try {
        // Check if user is a doctor
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'doctor') {
            return res.status(401).json({ msg: 'Not authorized as a doctor' });
        }

        const doctor = await Doctor.findOne({ userId: req.user.id })
            .populate('userId', ['name', 'email'])
            .populate('patients');

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        res.json(doctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all patients for a doctor
export const getDoctorPatients = async (req, res) => {
    try {
        // Check if user is a doctor
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'doctor') {
            return res.status(401).json({ msg: 'Not authorized as a doctor' });
        }

        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const patients = await Patient.find({ doctorId: doctor._id })
            .populate('userId', ['name', 'email']);

        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get patient details by ID
export const getDoctorPatientById = async (req, res) => {
    try {
        // Check if user is a doctor
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'doctor') {
            return res.status(401).json({ msg: 'Not authorized as a doctor' });
        }

        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const patient = await Patient.findOne({
            _id: req.params.patientId,
            doctorId: doctor._id
        }).populate('userId', ['name', 'email']);

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found or not assigned to you' });
        }

        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update a patient's information
export const updatePatientByDoctor = async (req, res) => {
    try {
        // Check if user is a doctor
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'doctor') {
            return res.status(401).json({ msg: 'Not authorized as a doctor' });
        }

        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        // Find the patient and ensure they're assigned to this doctor
        const patient = await Patient.findOne({
            _id: req.params.patientId,
            doctorId: doctor._id
        });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found or not assigned to you' });
        }

        // Update patient fields
        const patientUpdate = {};

        // Medical data
        if (req.body.age !== undefined) patientUpdate.age = Number(req.body.age);
        if (req.body.bmi !== undefined) patientUpdate.bmi = Number(req.body.bmi);
        if (req.body.gender !== undefined) patientUpdate.gender = req.body.gender;
        if (req.body.hasDiabetes !== undefined) {
            // Handle string 'true'/'false' or boolean true/false
            patientUpdate.hasDiabetes = req.body.hasDiabetes === 'true' || req.body.hasDiabetes === true;
        }
        if (req.body.painLevel !== undefined) patientUpdate.painLevel = Number(req.body.painLevel);
        if (req.body.surgeryDuration !== undefined) patientUpdate.surgeryDuration = Number(req.body.surgeryDuration);
        if (req.body.surgeryType !== undefined) patientUpdate.surgeryType = req.body.surgeryType;
        if (req.body.anesthesiaType !== undefined) patientUpdate.anesthesiaType = req.body.anesthesiaType;

        // Notes
        if (req.body.notes !== undefined) patientUpdate.notes = req.body.notes;

        console.log('Doctor updating patient profile with:', patientUpdate);

        const updatedPatient = await Patient.findByIdAndUpdate(
            patient._id,
            patientUpdate,
            { new: true }
        ).populate('userId', ['name', 'email']);

        res.json(updatedPatient);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get a patient's history (last 3 records of each type)
export const getPatientHistoryForDoctor = async (req, res) => {
    try {
        // Check if user is a doctor
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'doctor') {
            return res.status(401).json({ msg: 'Not authorized as a doctor' });
        }

        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const patient = await Patient.findOne({
            _id: req.params.patientId,
            doctorId: doctor._id
        });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found or not assigned to you' });
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

// @desc    Get team members (mock or real)
export const getTeamMembers = async (req, res) => {
    try {
        // In a real app, this would fetch from a database collection of staff/admins
        // For now, we return the hardcoded team data to serve the frontend
        const teamMembers = [
            {
                name: 'Dr. Sarah Chen',
                role: 'Chief Medical Officer',
                avatar: '/placeholder.svg?height=400&width=400',
            },
            {
                name: 'James Wilson',
                role: 'Lead Developer',
                avatar: '/placeholder.svg?height=400&width=400',
            },
            {
                name: 'Maria Garcia',
                role: 'Patient Coordinator',
                avatar: '/placeholder.svg?height=400&width=400',
            },
            {
                name: 'Dr. Robert Kim',
                role: 'Pain Specialist',
                avatar: '/placeholder.svg?height=400&width=400',
            },
            {
                name: 'Emily Davis',
                role: 'UX Designer',
                avatar: '/placeholder.svg?height=400&width=400',
            },
            {
                name: 'David Miller',
                role: 'Data Scientist',
                avatar: '/placeholder.svg?height=400&width=400',
            },
        ];

        res.json(teamMembers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get blog posts (mock or real)
export const getBlogPosts = async (req, res) => {
    try {
        const blogPosts = [
            {
                title: 'Understanding Chronic Pain Management',
                description:
                    'A comprehensive guide to modern approaches in managing chronic pain effectively.',
                date: '2024-03-15',
                author: 'Dr. Sarah Chen',
                content: `Chronic pain affects millions of people worldwide, yet it remains one of the most complex conditions to treat effectively. Unlike acute pain, which serves as a warning signal for injury, chronic pain persists long after the initial cause has healed.
  
  Modern pain management takes a multidisciplinary approach, combining medication, physical therapy, and psychological support. This holistic strategy addresses not just the physical sensation of pain, but also its emotional and psychological impact.
  
  Key components of effective management include:
  1. Regular monitoring and assessment
  2. Personalized medication plans
  3. Physical rehabilitation
  4. Stress management techniques
  5. Sleep hygiene improvements`,
            },
            // ... (other posts omitted for brevity but should be included if I want to keep full parity, assuming they are static)
            // I will include all of them to be safe
            {
                title: 'The Role of AI in Healthcare',
                description:
                    'How artificial intelligence is transforming patient care and diagnosis.',
                date: '2024-03-10',
                author: 'James Wilson',
                content: `Artificial Intelligence is revolutionizing the healthcare landscape, offering unprecedented opportunities for improving patient outcomes. From early diagnosis to personalized treatment plans, AI algorithms are helping doctors make more informed decisions.
  
  In pain management specifically, AI can analyze patterns in patient data to predict pain flare-ups and suggest preventive measures. This proactive approach helps in maintaining a better quality of life for patients.
  
  Our platform uses machine learning to:
  - Analyze pain trends
  - Predict medication effectiveness
  - Suggest personalized exercises
  - Monitor vital signs for anomalies`,
            },
            {
                title: 'Nutrition and Pain Relief',
                description:
                    'Exploring the connection between diet and inflammation reduction.',
                date: '2024-03-05',
                author: 'Maria Garcia',
                content: `What we eat plays a crucial role in how our bodies manage inflammation and pain. A diet rich in anti-inflammatory foods can significantly reduce pain levels and improve overall well-being.
  
  Foods that fight inflammation include:
  - Fatty fish (salmon, mackerel)
  - Berries and cherries
  - Leafy green vegetables
  - Nuts and seeds
  - Olive oil and turmeric
  
  Conversely, processed foods, excessive sugar, and refined carbohydrates can trigger inflammation and worsen pain symptoms.`,
            },
            {
                title: 'Mindfulness and Pain Control',
                description:
                    'Techniques including meditation for coping with severe pain.',
                date: '2024-02-28',
                author: 'Dr. Robert Kim',
                content: `Mindfulness meditation has emerged as a powerful tool in pain management. By changing how the brain processes pain signals, mindfulness can help reduce the subjective experience of pain.
  
  Techniques to try:
  1. Body scan meditation
  2. Focused breathing
  3. Guided imagery
  4. Progressive muscle relaxation
  
  Regular practice of these techniques has been shown to lower stress levels, improve sleep, and reduce reliance on pain medication.`,
            },
            {
                title: 'Exercise for Recovery',
                description:
                    'Safe exercises for post-surgery rehabilitation.',
                date: '2024-02-20',
                author: 'Dr. Sarah Chen',
                content: `Movement is medicine, even when recovering from surgery. While rest is important, controlled movement promotes healing, prevents blood clots, and maintains muscle strength.
  
  Start with:
  - Gentle stretching
  - Walking (as tolerated)
  - Range of motion exercises
  
  Always consult with your healthcare provider before starting any exercise routine post-surgery. Listen to your body and pace yourself.`,
            },
            {
                title: 'Understanding Pain Metrics',
                description:
                    'How to accurately report your pain levels for better treatment.',
                date: '2024-02-15',
                author: 'David Miller',
                content: `Accurate pain reporting is essential for effective treatment. The standard 0-10 scale is helpful but subjective. Understanding what each level represents ensures better communication with your doctor.
  
  Pain Scale Guide:
  0: No pain
  1-3: Mild pain (nagging, annoying, but doesn't interfere with daily living activities)
  4-6: Moderate pain (interferes significantly with daily living activities)
  7-10: Severe pain (disabling, unable to perform daily living activities)
  
  Also report:
  - Type of pain (sharp, dull, throbbing)
  - Duration and frequency
  - Triggers and relievers`,
            },
        ];
        res.json(blogPosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
