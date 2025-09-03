
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js"); // Import the listings routes
const reviewRouter = require("./routes/review.js"); // Import the reviews routes
const userRouter = require("./routes/user.js"); // Import the user routes

// for Authentication we require:- 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// Connect to MongoDB
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    retryWrites: true
  });
}

// Set the view engine to EJS
app.set("view engine", "ejs"); // this line of code means that we are using EJS as our templating engine
app.set("views", path.join(__dirname, "views")); // this line of code means that EJS will look for templates in the "views" folder
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use(express.json()); // Middleware to parse JSON bodies
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // Use ejs-mate for EJS
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory




// Mongo session store for production 
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "your_secret_key",  // the use of this line is to encrypt the session data, means that even if someone gets access to the session store, they won't be able to read the session data without the secret
  },
  touchAfter: 24 * 3600, // time in seconds
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
  }
});

  

store.on("error", (err) => {
  console.error("Error in MongoDB session store", err);
});


// Session middleware
const sessionOptions = {
  store,
  secret: process.env.SECRET || "your_secret_key",
  resave: false,  // don't save session if unmodified
  saveUninitialized: false,  // don't create session until something stored
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days milliseconds -> 7 * 24 * 60 * 60 * 1000 and we add that with the current time
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // cookie cannot be accessed via client-side scripts
  },
};




// Session middleware
app.use(session(sessionOptions));
app.use(flash()); // Flash middleware


// app.get("/", (req, res) => {
//   res.send("Hi I am root");
// });



// Passport authentication before session middleware
app.use(passport.initialize());  // Initialize Passport before using passport to every request
app.use(passport.session());  // Use sessions for Passport
passport.use(new LocalStrategy(User.authenticate())); // Use LocalStrategy with User model


passport.serializeUser(User.serializeUser()); // means when user login, so user related information is stored in session, so because of that we can access user information in other routes
passport.deserializeUser(User.deserializeUser()); // means when user makes a request, we can retrieve user information from session



// Middleware to set flash messages in response locals variable
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Set the current user in response locals
  next();
}); 




/*
// Demo user for Authentication, we use (register method) which can helps to save  a user and automatically checks username is unique or not
app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "abc@gmail.com",
    username: "fakeuser"
  });

  let registeredUser = await User.register(fakeUser, "hello");
  res.send(registeredUser);
});
*/

 


// Use listings routes
app.use("/listings", listingRouter); // Use the listings routes for any route starting with /listings


// Reviews Routes
app.use("/listings/:id/reviews", reviewRouter);

// User Routes
app.use("/", userRouter);


 

// Create a test listing
/*
app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "California",
        country: "USA",
    });

    await sampleListing.save();  // save the listing in the database
    console.log("Listing created");
    res.send("Listing created");
});
*/

// we throw an error for any unhandled routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// here we catch all errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
