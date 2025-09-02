

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// Passport local mongoose automatically stores username and hashed password, so we cannot define these fields in our schema. So for that we use the plugin.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);