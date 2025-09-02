
const Joi = require("joi");

// Listing Schema
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().valid(
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
        ).required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).unknown(true)
    }).required() 
});

// Review Schema
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().min(5).max(500).required()
    }).required()
});