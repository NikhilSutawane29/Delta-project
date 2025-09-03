
const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");



// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  try {
    if(!req.isAuthenticated()) { 
      // we save redirect URL
      req.session.redirectUrl = req.originalUrl; // here we save the original URL into the session

      // isAuthenticated middleware is provided by passport
      req.flash("error", "You must be logged in to create a listing");
      return res.redirect("/login");
    }
    next();
  } catch (err) {
    console.error("Error in isLoggedIn middleware:", err);
    next(err);
  }
}



// middleware to save the redirect URL in locals variable
module.exports.saveRedirectUrl = (req, res, next) => {
  try {
    if(req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  } catch (err) {
    console.error("Error in saveRedirectUrl middleware:", err);
    next(err);
  }
}



// Middleware to check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    if(!listing.owner || !res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    console.error("Error in isOwner middleware:", err);
    next(err);
  }
}




// Middleware to validate listing data
module.exports.validateListing = (req, res, next) => {
  try {
    // For debugging
    console.log("Validating listing data:", req.body);
    
    let { error } = listingSchema.validate(req.body); // Validate the listing data against the schema
    if (error) {
      console.log("Validation error:", error);
      let errMsg = error.details.map((el) => el.message).join(", ");
      return next(new ExpressError(400, errMsg)); // If validation fails, throw an error
    } else {
      next();
    }
  } catch (err) {
    console.error("Error in validateListing middleware:", err);
    next(err);
  }
};




// Middleware for validate Review
module.exports.validateReview = (req, res, next) => {
  try {
    console.log("Validating review data:", req.body);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      console.log("Review validation error:", error);
      const msg = error.details.map(el => el.message).join(",");
      return next(new ExpressError(400, msg));
    } else {
      next();
    }
  } catch (err) {
    console.error("Error in validateReview middleware:", err);
    next(err);
  }
};




// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }
    if(!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);  
    }
    next();
  } catch (err) {
    console.error("Error in isReviewAuthor middleware:", err);
    next(err);
  }
};