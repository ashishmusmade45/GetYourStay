const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const {validateReview} = require("../middleware.js");
const {isLoggedIn,isOwner,validateListing,isAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// POST ROUTE OF REVIEWS
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.postReview));

//DELETE ROUTE FOR REVIEWS
router.delete("/:reviewId",isAuthor,isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;