import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/database";
import User from "../models/User";
import { ROLES } from "../constants/role";

dotenv.config();

const usersToSeed = [
  {
    firstName: "Super",
    lastName: "Admin",
    email: "admin@futurecubs.com",
    password: "Admin@123",
    role: ROLES.SUPER_ADMIN,
  },
  {
    firstName: "Test",
    lastName: "Admin",
    email: "testadmin@futurecubs.com",
    password: "Admin@123",
    role: ROLES.ADMIN,
  },
  {
    firstName: "Test",
    lastName: "Teacher",
    email: "teacher@futurecubs.com",
    password: "Teacher@123",
    role: ROLES.TEACHER,
  },
  {
    firstName: "Test",
    lastName: "Parent",
    email: "parent@futurecubs.com",
    password: "Parent@123",
    role: ROLES.PARENT,
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    for (const userData of usersToSeed) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`✅ ${userData.role} already exists (${userData.email})`);
        continue;
      }

      await User.create({
        ...userData,
        status: true,
      });

      console.log(`🎉 ${userData.role} created successfully (${userData.email})`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();