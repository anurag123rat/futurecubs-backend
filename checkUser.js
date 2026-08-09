require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await mongoose.connection.db
    .collection("users")
    .findOne({ role: { $in: ["admin", "teacher"] } });
  console.log(user);
  process.exit(0);
});