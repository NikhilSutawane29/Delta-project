const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// we require controller's file
const userController = require("../controllers/users.js");



// New Concept - Router.route:

// [1] here we combine Signup routes
router.route("/signup")
  .get(userController.showSignupForm) // Signup form
  .post(wrapAsync(userController.signup));



// [2] here we combine Login routes
router.route("/login")
  .get(userController.showLoginForm) // Login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );


// Logout
router.get("/logout", userController.logout);

module.exports = router;


