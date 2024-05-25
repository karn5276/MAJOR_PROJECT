const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");


const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:{
        type:String,
        required:true
    },
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User", // b'coz owner must be register or sign up that's why its refer to user model.
    }
});

// below middleware is used to delete all review when listing is deleted.

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;