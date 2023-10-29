const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport")
const {saveUrl} = require("../middleware.js");
const userController = require("../controllers/users")

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveUrl, passport.authenticate("local",
 { failureRedirect: "/login", failureFlash: true }), userController.login);


// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup));

// router.get("/login", userController.renderLoginForm);

// router.post("/login", saveUrl, passport.authenticate("local",
//  { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;