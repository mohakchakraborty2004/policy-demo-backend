import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config(); 

import PolicyHolder from './model/policyholder';

const seedData = [
  // 1. The Original User (Robert) - RETIRED
  {
    mrn: "45678901",
    personalInfo: {
      fullName: { first: "Robert", middle: "James", last: "Wilson" },
      dob: new Date("1968-08-14"),
      gender: "Male",
      contact: {
        address: "742 Evergreen Terrace",
        city: "Springfield",
        state: "IL",
        zip: "62704",
        phone: "(217) 555-7281",
        email: "robert.wilson58@example.com"
      }
    },
    policies: [
      {
        type: "Medical",
        providerName: "UnitedHealthcare",
        planName: "Medicare Advantage PPO",
        policyNumber: "UHC-987654321",
        groupNumber: "RET-001",
        subscriber: "Self",
        status: "Active",
        copay: 40,
        deductible: 150,
        effectiveDate: { start: new Date("2025-01-01"), end: new Date("2026-12-31") }
      },
      {
        type: "Vision",
        providerName: "VSP",
        planName: "Gold Vision",
        policyNumber: "VSP-11223344",
        subscriber: "Self",
        status: "Active",
        copay: 10,
        deductible: 0,
        effectiveDate: { start: new Date("2025-01-01"), end: new Date("2026-12-31") }
      }
    ]
  },

  // 2. Young Professional (Tech)
  {
    mrn: "10293847",
    personalInfo: {
      fullName: { first: "Sarah", last: "Chen" },
      dob: new Date("1998-05-22"),
      gender: "Female",
      contact: {
        address: "101 Tech Park Blvd, Apt 4B",
        city: "Austin",
        state: "TX",
        zip: "78701",
        phone: "(512) 555-0199",
        email: "sarah.chen@techmail.com"
      }
    },
    policies: [
      {
        type: "Medical",
        providerName: "Blue Cross Blue Shield",
        planName: "Blue Premier HMO",
        policyNumber: "BCBS-TX-998877",
        groupNumber: "TECH-CORP-01",
        subscriber: "Self",
        status: "Active",
        copay: 25,
        deductible: 2000, // High deductible
        effectiveDate: { start: new Date("2025-03-01"), end: new Date("2026-03-01") }
      },
      {
        type: "Dental",
        providerName: "Delta Dental",
        planName: "PPO Plus Premier",
        policyNumber: "DD-554433",
        subscriber: "Self",
        status: "Active",
        copay: 0,
        deductible: 50,
        effectiveDate: { start: new Date("2025-03-01"), end: new Date("2026-03-01") }
      }
    ]
  },

  // 3. Family Plan (Mother + Kids)
  {
    mrn: "56473829",
    personalInfo: {
      fullName: { first: "Maria", middle: "Elena", last: "Rodriguez" },
      dob: new Date("1985-11-30"),
      gender: "Female",
      contact: {
        address: "88 Maple Drive",
        city: "Denver",
        state: "CO",
        zip: "80203",
        phone: "(303) 555-1234",
        email: "maria.rodz@example.com"
      }
    },
    policies: [
      {
        type: "Medical",
        providerName: "Kaiser Permanente",
        planName: "Gold Family HMO",
        policyNumber: "KP-11229988",
        groupNumber: "CO-EDU-DIST",
        subscriber: "Spouse", // Coverage via husband
        status: "Active",
        copay: 15,
        deductible: 500,
        effectiveDate: { start: new Date("2025-01-01"), end: new Date("2025-12-31") }
      }
    ]
  },

  // 4. College Student (Dependent)
  {
    mrn: "99887766",
    personalInfo: {
      fullName: { first: "Jason", last: "Smith" },
      dob: new Date("2004-02-14"),
      gender: "Male",
      contact: {
        address: "University Dorms - Hall A",
        city: "Boston",
        state: "MA",
        zip: "02115",
        phone: "(617) 555-9876",
        email: "jason.smith@uni.edu"
      }
    },
    policies: [
      {
        type: "Medical",
        providerName: "Aetna",
        planName: "Student Health Choice",
        policyNumber: "AE-STU-445566",
        subscriber: "Parent", // Dependent
        status: "Active",
        copay: 50,
        deductible: 500,
        effectiveDate: { start: new Date("2024-09-01"), end: new Date("2025-08-31") }
      }
    ]
  },

  // 5. Senior (Complex Care)
  {
    mrn: "33445566",
    personalInfo: {
      fullName: { first: "Eleanor", last: "Rigby" },
      dob: new Date("1945-06-12"),
      gender: "Female",
      contact: {
        address: "22 Abbey Road",
        city: "Liverpool",
        state: "NY", // Liverpool, NY
        zip: "13088",
        phone: "(315) 555-7777",
        email: "eleanor.r@seniorliving.com"
      }
    },
    policies: [
      {
        type: "Medical",
        providerName: "Medicare",
        planName: "Part A & B",
        policyNumber: "1122-3344-5566",
        subscriber: "Self",
        status: "Active",
        copay: 0,
        deductible: 240,
        effectiveDate: { start: new Date("2010-06-12"), end: new Date("2030-12-31") }
      },
      {
        type: "Medical",
        providerName: "Humana",
        planName: "Medigap Plan G",
        policyNumber: "H-998877",
        subscriber: "Self",
        status: "Active",
        copay: 0,
        deductible: 0,
        effectiveDate: { start: new Date("2020-01-01"), end: new Date("2026-01-01") }
      }
    ]
  },

  // 6. Freelancer (Gap Coverage)
  {
    mrn: "77700011",
    personalInfo: {
      fullName: { first: "David", last: "Kim" },
      dob: new Date("1990-09-09"),
      gender: "Male",
      contact: {
        address: "450 Freelance Way",
        city: "Portland",
        state: "OR",
        zip: "97209",
        phone: "(503) 555-4444",
        email: "dave.design@studio.com"
      }
    },
    policies: [
      {
        type: "Medical",
        providerName: "Oscar Health",
        planName: "Bronze Saver",
        policyNumber: "OSC-123123",
        subscriber: "Self",
        status: "Pending", // Coverage hasn't started yet
        copay: 75,
        deductible: 6000,
        effectiveDate: { start: new Date("2026-03-01"), end: new Date("2026-12-31") }
      }
    ]
  }
];

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    //@ts-ignore
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🔌 Connected to DB: ${mongoose.connection.name}`);

    // Clear existing data to avoid duplicates
    await PolicyHolder.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Insert new batch
    await PolicyHolder.insertMany(seedData);
    console.log(`✅ Seeded ${seedData.length} users successfully!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seed();