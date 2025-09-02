
// MVC - controller
// Here we store all the review-related route callbacks

const Listing = require("../models/listing.js"); // Import the Listing model
const Review = require("../models/review.js");





// Review's create route's callback
module.exports.createReview = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id); // Find the listing by ID from the route parameters
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Associate the review with the logged-in user

    listing.reviews.push(newReview); // Push the new review into the listing's reviews array

    await newReview.save(); // Save the new review to the database
    await listing.save(); // Save the updated listing to the database

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  };




// Review's delete route's callback
module.exports.destroyReview = async (req, res, next) => {
    let { id, reviewId } = req.params; // Extract the id and reviewId from the request parameters

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove(pull) the review from the listing's reviews array
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  };