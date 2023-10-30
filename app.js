if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/reviews.js")
const { reviewSchema } = require("./schema.js")


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); 


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"

const db_url = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: db_url,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600
})

store.on("error", ()=>{
    console.log("MONGO SESSION ERROR IS", err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



main().then(() => {
    console.log("connection success")
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect(db_url)
}



// app.get("/testSch", async (req, res) => {
//     const newListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute Goa",
//         country: "India"
//     });

//     await newListing.save();
//     console.log("successfully saved");
//     res.send("successfull testing");
// })



app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    console.log(res.locals.success);
    res.locals.error = req.flash("error");
    console.log(res.locals.error);
    res.locals.currUsr = req.user;
    next();
})

// app.use((req, res, next) => {
//     res.locals.error = req.flash("error");
//     console.log(res.locals.error);
//     next();
// })



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// Index Route


// Show Route

// Add Route
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
//     // if (!req.body.listing) {
//     //     throw new ExpressError(404, "Client side error")
//     // }

//     const newListing = new Listing(req.body.listing);
//     // if(!newListing.description){
//     //     throw new ExpressError(404, "Description not given");
//     // }
//     // if(!newListing.price){
//     //     throw new ExpressError(404, "price not given");
//     // }
//     // if(!newListing.location){
//     //     throw new ExpressError(404, "location not given");
//     // }
//     await newListing.save();
//     res.redirect("/listings")

// }))







// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// })

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    //    res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message });
})

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = ({
//         email: "student@gmail.com",
//         username: "delta-student"
//     })
//     let registerUser = await User.register(fakeUser, "helloworld");
//     res.send(registerUser);
// })


// app.post("/listings/:id/reviews", reviewListing, wrapAsync(async (req, res) => {

//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     // console.log("new review saved");
//     // res.send("new review saved");

//     res.redirect(`/listings/${listing._id}`)

// }));

app.listen(8080, () => {
    console.log("app is listening on 8080")
})