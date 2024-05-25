const express=require("express");
const router = express.Router();
// const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync.js");

const listingController=require("../controllers/listings");
const {isLoggedIn,validateListing,isOwner}=require("../middleware");
// image upload packages.
const multer  = require('multer');
const {storage}=require("../cloudConfig/cloudinary");
const upload = multer({ storage });



// LISTING

// below data we are comment b'coz it can be enter in database again and again.

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//     title:"My New Villa",
//     description:"By the beach",
//     price:1200,
//     location:"pune akurdi",
//     country:"india"
//     });

//        await sampleListing.save();
//        console.log("sample was saved");
//        res.send("successful testing");
// });



router.route("/")
    // index route
    .get(wrapAsync(listingController.index))
    // create route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)
);                   //      |                          |
                    //   write above middleware before validateListing middleware
   



// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
// SHOW ROUTE 
.get(wrapAsync(listingController.showListing))
//update route
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
// DELETE ROUTE
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// EDIT ROUTE 
 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports=router;