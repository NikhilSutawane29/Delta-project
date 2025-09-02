// MVC - controller
// Here we store all the user-related route callbacks

const User = require("../models/user.js");

// show signup.ejs form callback
module.exports.showSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// User's Post route's callback which can do signup
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Create a new user
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password); // Register the user can be save in the database
    console.log(registeredUser);
    // Automatically log in the user after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// show login.ejs form callback
module.exports.showLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// login callback
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl); // here we redirect to the original URL
};

// logout callback
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/login");
  });
};
