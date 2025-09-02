const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=974&auto=format&fit=crop&ixlib=rb-4.1.0",
      set: v => v === "" ? "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=974&auto=format&fit=crop&ixlib=rb-4.1.0" : v
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },  
  category: {
    type: String,
    enum: [
      "trending",
      "top-rated",
      "most-popular",
      "mountains",
      "castle",
      "swimming-pool",
      "camping",
      "most-recent",
      "farms",
      "arctic"
    ]
  }
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});



const Listing = mongoose.model("Listing", listingSchema); // Create a model for the listing schema

module.exports = Listing;
