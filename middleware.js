const Listing=require("./models/listings");
const Review=require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // below method is for authenticating(login) user or not.if user is login then or then user will be create new listings.
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl; 
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; // here we are store above in this locals variable b'cos passport latter delete above variable and we want this variable.
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","you are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isAthorReview=async(req,res,next)=>{
    let {reviewId,id}=req.params;
    let review=await Review.findById(reviewId);
    
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}