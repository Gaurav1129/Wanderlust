const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {loggedIn, isOwner} = require("../middleware.js")
const {validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing, wrapAsync(listingController.addListing))


// // Index Route
// router.get("/", wrapAsync(listingController.index));

// Create Route
router.get("/new",loggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(loggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(loggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// // Add Route
// router.post("/", validateListing, wrapAsync(listingController.addListing));

//Edit Route
router.get("/:id/edit", loggedIn, isOwner, wrapAsync(listingController.editListing));

// //UPDATE ROUTE
// router.put("/:id", loggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// //DELETE ROUTE
// router.delete("/:id",  loggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;