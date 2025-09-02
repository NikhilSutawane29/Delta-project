const express = require("express");
const router = express.Router({ mergeParams: true }); // Enable mergeParams to access params from parent router
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // Import the Listing model
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//  we require controller's files
const reviewController = require("../controllers/reviews.js");

// Reviews Routes
// POST Route for creating a new review when we click on submit button which we define in show.ejs
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Reviews Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
