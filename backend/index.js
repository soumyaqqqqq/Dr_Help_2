import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// jwt import removed (unused)
import connectDB from './config/db.js';
import corsOptions from './config/cors.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));

// JSON body parser with request logging
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      try {
        const body = JSON.parse(buf.toString());
        console.log(`Request body to ${req.url}:`, body);
      } catch (e) {
        console.log('Could not log request body (not valid JSON)');
      }
    }
  }
}));

app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from PainSense Backend API!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Import routes
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import patientRoutes from './routes/patients.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});
