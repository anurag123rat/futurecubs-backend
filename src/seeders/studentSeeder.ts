import dotenv from "dotenv";
import connectDB from "../config/database";
import User from "../models/User";
import Student from "../models/Student";
import { ROLES } from "../constants/role";

dotenv.config();

const seedStudent = async () => {
  try {
    await connectDB();

    const parent = await User.findOne({ role: ROLES.PARENT });
    const teacher = await User.findOne({ role: ROLES.TEACHER });

    if (!parent || !teacher) {
      console.log("❌ Parent or Teacher user not found. Run superAdminSeeder first.");
      process.exit(1);
    }

    const existing = await Student.findOne({ parentId: parent._id });

    if (existing) {
      console.log(`✅ Test student already exists: ${existing.firstName} (id: ${existing._id})`);
      process.exit(0);
    }

    const student = await Student.create({
      firstName: "Aarav",
      lastName: "Test",
      age: 4,
      parentId: parent._id,
      teacherId: teacher._id,
      status: true,
    });

    console.log(`🎉 Test student created: ${student.firstName} (id: ${student._id})`);
    console.log(`   parentId: ${parent._id}`);
    console.log(`   teacherId: ${teacher._id}`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedStudent();