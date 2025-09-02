// MVC - Controller - it helps separate the business logic from the route definitions
// Here we stores all backend routes callback

const Listing = require("../models/listing.js"); // Import the Listing model

// Index route's callback
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// New route's callback
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show route's callback
module.exports.showListing = async (req, res) => {
  let { id } = req.params; // Extract the id from the request parameters
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }

  console.log("Listing found:", listing);
  res.render("listings/show.ejs", { listing }); // Render the show template with the listing data
};

// Create route's callback
module.exports.createListing = async (req, res, next) => { 
  let filename = req.file.filename;
  let url = req.file.path;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Associate the listing with the logged-in user
  newListing.image = { url, filename }; // Set the image field with the uploaded file's URL and filename
  await newListing.save(); 
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Edit route's callback
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.petersarams; // Extract the id from the request param
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  let originalImgUrl = listing.image.url
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_300,w_200") // to resize the image

  res.render("listings/edit.ejs", { listing, originalImgUrl });
};

// Update roue's callback
module.exports.updateListing = async (req, res) => {
  let { id } = req.params; // Extract the id from the request parameters
  console.log("Update data:", req.body.listing);

  // Handle the case where the image field might be empty or a string
  if (req.body.listing && typeof req.body.listing.image === "string") {
    req.body.listing.image = {
      url: req.body.listing.image,
      filename: "default",
    };
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename }; // Update the image field with the new uploaded file's URL and filename
    await updatedListing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Destroy(Delete) route's callback
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params; // Extract the id from the request parameters
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing:", deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
