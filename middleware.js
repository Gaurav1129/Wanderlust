const Listing = require("./models/listing")
const Review = require("./models/reviews")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.loggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUsr._id)) {
        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = ((req, res, next) => {
    let { err } = listingSchema.validate(req.body);

    if (err) {
        let errMsg = err.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg);
    } else {
        next();
    }
})

module.exports.reviewListing = ((req, res, next) => {
    let { err } = reviewSchema.validate(req.body);

    if (err) {
        let errMsg = err.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg);
    } else {
        next();
    }
})

module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUsr._id)) {
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}


