const express = require("express");
const router = express.Router(); // Create a new router instance means we can define routes on this object
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js"); // Import the Listing model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Import the isLoggedIn middleware
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });

// we require controller's files
const listingController = require("../controllers/listings.js");

// New Concept - Router.route:

// [1] here we combine Index and Create routes because it's path are same for any request -> "/"
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image][file]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );
  


// New Route: - we create a button in index.ejs file and when we click on that button we will come on this /listings/new route.
router.get("/new", isLoggedIn, listingController.renderNewForm);




// [2] here we combine Show, Update and Delete routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][file]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



  
// Edit Route :- which we give option in show.ejs for edit and this route helps pre-fill the form with existing data
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router; // Export the router so it can be used in app.js
