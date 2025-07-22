const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {validateReview} = require("../middleware.js");

module.exports.postReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    
    res.redirect(`/listing/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listing/${id}`);
}