const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PRODUCTION);
  } catch (error) {
    console.error("Database connection error:", error);

    process.exit(1);
  }
}

mongoose.connection.on("error", (err) => {
  logError(err);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = connectDatabase;
