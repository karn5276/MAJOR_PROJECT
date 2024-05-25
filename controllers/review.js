const Listing=require("../models/listings");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    console.log("req.user._id  ",req.user._id);
    newReview.author=req.user._id;
    console.log("karn ==> ",newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review save");
    // res.send("review saved");
    console.log("REVIEW ==>",newReview);
    req.flash("success","Review created")


    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    // pull means removing element from array    reviews=this is array name and reviewId= is removing object id.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    
    res.redirect(`/listings/${id}`);
}