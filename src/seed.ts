import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config();

// Ensure these paths match your actual file structure
import PolicyHolder from './model/policyholder';
import Provider from './model/provider';
import Appointment from './model/appointment';

// --- 1. PATIENT DATA (PolicyHolders) ---
const patientData = [
  {
    mrn: "45678901",
    personalInfo: {
      fullName: { first: "Robert", middle: "James", last: "Wilson" },
      dob: new Date("1968-08-14"),
      gender: "Male",
      contact: { address: "742 Evergreen Terrace", city: "Springfield", state: "IL", zip: "62704", phone: "(217) 555-7281", email: "robert.wilson58@example.com" }
    },
    policies: [
      { type: "Medical", providerName: "UnitedHealthcare", planName: "Medicare Advantage PPO", policyNumber: "UHC-987654321", groupNumber: "RET-001", subscriber: "Self", status: "Active", copay: 40, deductible: 150, effectiveDate: { start: new Date("2025-01-01"), end: new Date("2026-12-31") } },
      { type: "Vision", providerName: "VSP", planName: "Gold Vision", policyNumber: "VSP-11223344", subscriber: "Self", status: "Active", copay: 10, deductible: 0, effectiveDate: { start: new Date("2025-01-01"), end: new Date("2026-12-31") } }
    ]
  },
  {
    mrn: "10293847",
    personalInfo: {
      fullName: { first: "Sarah", last: "Chen" },
      dob: new Date("1998-05-22"),
      gender: "Female",
      contact: { address: "101 Tech Park Blvd, Apt 4B", city: "Austin", state: "TX", zip: "78701", phone: "(512) 555-0199", email: "sarah.chen@techmail.com" }
    },
    policies: [
      { type: "Medical", providerName: "Blue Cross Blue Shield", planName: "Blue Premier HMO", policyNumber: "BCBS-TX-998877", groupNumber: "TECH-CORP-01", subscriber: "Self", status: "Active", copay: 25, deductible: 2000, effectiveDate: { start: new Date("2025-03-01"), end: new Date("2026-03-01") } }
    ]
  },
  {
    mrn: "56473829",
    personalInfo: {
      fullName: { first: "Maria", middle: "Elena", last: "Rodriguez" },
      dob: new Date("1985-11-30"),
      gender: "Female",
      contact: { address: "88 Maple Drive", city: "Denver", state: "CO", zip: "80203", phone: "(303) 555-1234", email: "maria.rodz@example.com" }
    },
    policies: [
      { type: "Medical", providerName: "Kaiser Permanente", planName: "Gold Family HMO", policyNumber: "KP-11229988", groupNumber: "CO-EDU-DIST", subscriber: "Spouse", status: "Active", copay: 15, deductible: 500, effectiveDate: { start: new Date("2025-01-01"), end: new Date("2025-12-31") } }
    ]
  },
  {
    mrn: "99887766",
    personalInfo: {
      fullName: { first: "Jason", last: "Smith" },
      dob: new Date("2004-02-14"),
      gender: "Male",
      contact: { address: "University Dorms - Hall A", city: "Boston", state: "MA", zip: "02115", phone: "(617) 555-9876", email: "jason.smith@uni.edu" }
    },
    policies: [
      { type: "Medical", providerName: "Aetna", planName: "Student Health Choice", policyNumber: "AE-STU-445566", subscriber: "Parent", status: "Active", copay: 50, deductible: 500, effectiveDate: { start: new Date("2024-09-01"), end: new Date("2025-08-31") } }
    ]
  },
  {
    mrn: "33445566",
    personalInfo: {
      fullName: { first: "Eleanor", last: "Rigby" },
      dob: new Date("1945-06-12"),
      gender: "Female",
      contact: { address: "22 Abbey Road", city: "Liverpool", state: "NY", zip: "13088", phone: "(315) 555-7777", email: "eleanor.r@seniorliving.com" }
    },
    policies: [
      { type: "Medical", providerName: "Medicare", planName: "Part A & B", policyNumber: "1122-3344-5566", subscriber: "Self", status: "Active", copay: 0, deductible: 240, effectiveDate: { start: new Date("2010-06-12"), end: new Date("2030-12-31") } }
    ]
  },
  {
    mrn: "77700011",
    personalInfo: {
      fullName: { first: "David", last: "Kim" },
      dob: new Date("1990-09-09"),
      gender: "Male",
      contact: { address: "450 Freelance Way", city: "Portland", state: "OR", zip: "97209", phone: "(503) 555-4444", email: "dave.design@studio.com" }
    },
    policies: [
      { type: "Medical", providerName: "Oscar Health", planName: "Bronze Saver", policyNumber: "OSC-123123", subscriber: "Self", status: "Pending", copay: 75, deductible: 6000, effectiveDate: { start: new Date("2026-03-01"), end: new Date("2026-12-31") } }
    ]
  }
];

// --- 2. DOCTOR DATA (Providers) ---
const providerData = [
  {
    npi: "1122334455",
    name: { first: "Emily", last: "Carter", title: "MD" },
    specialty: "Internal Medicine",
    department: "Primary Care"
  },
  {
    npi: "9988776655",
    name: { first: "Alan", last: "Grant", title: "OD" },
    specialty: "Ophthalmology",
    department: "Eye Care Center"
  }
];

// --- 3. MAPPING DATA (Appointments) ---
const appointmentData = [
  {
    patientMrn: "45678901", // Robert Wilson
    providerNpi: "9988776655", // Dr. Grant (Eye Care)
    scheduledTime: new Date(new Date().setHours(9, 0, 0, 0)), // Today at 9:00 AM
    status: "Arrived",
    chiefComplaint: "Routine annual eye exam; mild blurring at near",
    knownIssues: ["Presbyopia (H52.4)", "Mild Dry Eye (H04.129)", "Type 2 Diabetes"],
    financialClearance: {
      eligibilityVerified: true,
      priorAuthRequired: false,
      priorAuthStatus: "N/A"
    }
  },
  {
    patientMrn: "10293847", // Sarah Chen
    providerNpi: "1122334455", // Dr. Carter (Internal Med)
    scheduledTime: new Date(new Date().setHours(10, 30, 0, 0)), // Today at 10:30 AM
    status: "Scheduled",
    chiefComplaint: "Persistent migraines and fatigue",
    knownIssues: ["Migraine with aura"],
    financialClearance: {
      eligibilityVerified: true,
      priorAuthRequired: true,
      priorAuthStatus: "Pending" // Flag this on the dashboard!
    }
  },
  {
    patientMrn: "56473829", // Maria Rodriguez
    providerNpi: "1122334455", // Dr. Carter
    scheduledTime: new Date(new Date().setHours(13, 0, 0, 0)), // Today at 1:00 PM
    status: "Scheduled",
    chiefComplaint: "Annual Physical Exam",
    knownIssues: [],
    financialClearance: {
      eligibilityVerified: true,
      priorAuthRequired: false,
      priorAuthStatus: "N/A"
    }
  },
  {
    patientMrn: "99887766", // Jason Smith
    providerNpi: "9988776655", // Dr. Grant
    scheduledTime: new Date(new Date().setHours(14, 15, 0, 0)), // Today at 2:15 PM
    status: "Scheduled",
    chiefComplaint: "Sports-related eye injury checkup",
    knownIssues: ["Asthma"],
    financialClearance: {
      eligibilityVerified: true,
      priorAuthRequired: true,
      priorAuthStatus: "Approved"
    }
  },
  {
    patientMrn: "33445566", // Eleanor Rigby
    providerNpi: "1122334455", // Dr. Carter
    scheduledTime: new Date(new Date().setHours(8, 0, 0, 0)), // Today at 8:00 AM
    status: "Completed",
    chiefComplaint: "Follow up on hypertension medication",
    knownIssues: ["Hypertension", "Osteoarthritis"],
    financialClearance: {
      eligibilityVerified: true,
      priorAuthRequired: false,
      priorAuthStatus: "N/A"
    }
  },
  {
    patientMrn: "77700011", // David Kim
    providerNpi: "9988776655", // Dr. Grant
    scheduledTime: new Date(new Date().setHours(15, 30, 0, 0)), // Today at 3:30 PM
    status: "Cancelled",
    chiefComplaint: "Specialty lens consultation",
    knownIssues: [],
    financialClearance: {
      eligibilityVerified: false,
      priorAuthRequired: true,
      priorAuthStatus: "Denied" // Good for demonstrating back-end denials tracking
    }
  }
];

// --- 4. EXECUTE SEED ---
const seed = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in .env");
    process.exit(1);
  }

  try {
    // @ts-ignore
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🔌 Connected to DB: ${mongoose.connection.name}`);

    // Clear existing data to avoid duplicates
    await PolicyHolder.deleteMany({});
    await Provider.deleteMany({});
    await Appointment.deleteMany({});
    console.log('🧹 Cleared existing data for Patients, Providers, and Appointments');

    // Insert new batches
    await PolicyHolder.insertMany(patientData);
    await Provider.insertMany(providerData);
    await Appointment.insertMany(appointmentData);
    
    console.log(`✅ Seeded ${patientData.length} Patients successfully!`);
    console.log(`✅ Seeded ${providerData.length} Doctors successfully!`);
    console.log(`✅ Seeded ${appointmentData.length} Appointments successfully!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seed();