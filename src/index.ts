import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db'; // Import your existing DB connection
import PolicyHolder from './model/policyholder'; // Import the model

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Routes

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

// 4. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});