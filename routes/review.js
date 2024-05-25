const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings");
const {validateReview,isLoggedIn,isAthorReview}=require("../middleware");
const reviewController=require("../controllers/review.js");



// review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isAthorReview,wrapAsync(reviewController.destroyReview));

module.exports = router;