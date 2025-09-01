const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

async function makeAdminPermanent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await User.findOneAndUpdate(
      { _id: "68667e7a240af5cb79f4413c", email: "admin@example.com" },
      { $set: { isPermanent: true, role: "admin" } },
      { new: true }
    );
    if (admin) {
      console.log("Admin user is now permanent:", admin);
    } else {
      console.log("Admin user not found.");
    }
    process.exit();
  } catch (error) {
    console.error("Error making admin permanent:", error);
    process.exit(1);
  }
}

makeAdminPermanent(); 