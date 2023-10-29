const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js")
const { reviewListing, loggedIn, isReviewAuthor } = require("../middleware.js")
const reviewController  = require("../controllers/reviews.js");

router.post("/", loggedIn, reviewListing, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", loggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
