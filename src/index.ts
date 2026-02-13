import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db'; 
import PolicyHolder from './model/policyholder'; 
import Provider from './model/provider'; // <--- NEW IMPORT
import Appointment from './model/appointment'; // <--- NEW IMPORT

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors({
  origin: '*', // Allow ALL origins for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json());


// ==========================================
// 3. DASHBOARD ROUTES (NEW)
// ==========================================

// @route   GET /api/providers
// @desc    Get list of all doctors (for the dashboard dropdown)
app.get('/api/providers', async (req: Request, res: Response) => {
  try {
    const providers = await Provider.find();
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// @route   GET /api/dashboard/schedule/:npi
// @desc    Get a specific doctor's daily schedule mapped to patient data
app.get('/api/dashboard/schedule/:npi', async (req: Request, res: Response) => {
  try {
    const { npi } = req.params;
    
    // Using aggregation to join Appointments with PolicyHolders
    const schedule = await Appointment.aggregate([
      { $match: { providerNpi: npi } },
      { 
        $lookup: {
          from: 'policyholders', // MongoDB automatically pluralizes the collection name
          localField: 'patientMrn',
          foreignField: 'mrn',
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' }, // Flattens the array so patient details are an object
      { $sort: { scheduledTime: 1 } } // Sort chronologically
    ]);

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// @route   GET /api/dashboard/clearance-alerts
// @desc    Get all appointments needing Prior Authorization or Eligibility checks (Front-End RCM)
app.get('/api/dashboard/clearance-alerts', async (req: Request, res: Response) => {
  try {
    const alerts = await Appointment.aggregate([
      // Match 2025 RCM priorities: Pending/Denied auths OR unverified eligibility
      { 
        $match: { 
          $or: [
            { 'financialClearance.priorAuthStatus': { $in: ['Pending', 'Denied'] } },
            { 'financialClearance.eligibilityVerified': false }
          ]
        } 
      },
      { 
        $lookup: {
          from: 'policyholders',
          localField: 'patientMrn',
          foreignField: 'mrn',
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $lookup: {
          from: 'providers',
          localField: 'providerNpi',
          foreignField: 'npi',
          as: 'providerDetails'
        }
      },
      { $unwind: '$providerDetails' },
      { $sort: { scheduledTime: 1 } }
    ]);

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});


// ==========================================
// 4. EXISTING PATIENT ROUTES
// ==========================================

// GET /api/policy-holders - Fetch all users
app.get('/api/policy-holders', async (req: Request, res: Response) => {
  try {
    const holders = await PolicyHolder.find();
    res.status(200).json(holders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// GET /api/policy-holders/:mrn - Fetch specific user by MRN
app.get('/api/policy-holders/:mrn', async (req: Request, res: Response) => {
  try {
    const { mrn } = req.params;
    const holder = await PolicyHolder.findOne({ mrn });

    if (!holder) {
      res.status(404).json({ message: 'Policy Holder not found' });
      return;
    }

    res.status(200).json(holder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: (error as Error).message });
  }
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});