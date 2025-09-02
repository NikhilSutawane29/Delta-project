// we write whole logic of initialization here

const mongoose = require("mongoose");
const initData = require("./data.js"); // Import the sample data
const Listing = require("../models/listing.js"); // Import the Listing model

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); // Clear existing listings
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68aeddddfb22d68bf28e6f00",
  })); // here we create a new array and in that we add the owner field with our listing object
  await Listing.insertMany(initData.data); // Insert sample listings

  console.log("Database initialized with sample listings");
};

initDB();
