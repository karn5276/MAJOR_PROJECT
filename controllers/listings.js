const Listing=require("../models/listings");

module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({}); // here we are store all listings in a variable which is a array of objects.
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
    const singleListing=await Listing.findById(id)
    .populate({ // nesting populate
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!singleListing){
        req.flash("error","listing you are requsted does not exit");
        res.redirect("/listings");
    }
    console.log(singleListing);
    res.render("listings/show.ejs",{singleListing});
    // console.log(singleListing._id);
    
}

module.exports.createListing=async(req,res,next)=>{

    // let {title,description,location,country,image,price} = req.body;
    // await Listing.insertMany({
    //     title:title,
    //     description:description,
    //     price:price,
    //     image:image,
    //     location:location,
    //     country:country
    // });

    //  OR
    
//   if(!req.body.listing){  // this is for sending req from postman and not send any listing, sending empty listing.
//     throw new ExpressError(400,"please send valid listing");
//   }
 
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id; // this is storing current user id which is currently logged in. this is for when user create new listing then we have to show the owner of that listing who is create that listings.
    
   
    newListing.image={url,filename};

    await newListing.save();
    // Listing.createIndex({location:"text"},{backgroung:true});

    req.flash("success","new listing created")
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id} =req.params;
    const singleListing=await Listing.findById(id);
    if(!singleListing){
        req.flash("error","listing you are requsted does not exit");
        res.redirect("/listings");
    }

    let originalImageUrl=singleListing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_30,w_25");
    res.render("listings/edit.ejs",{singleListing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id} =req.params;
    
    
   let updatedListing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file!=="undefined"){ // req.file contain image which is upload.
       let url=req.file.path;
       let filename=req.file.filename;
       updatedListing.image={url,filename};
       await updatedListing.save();
       console.log("req.file ==> ",req.file);
    }

    req.flash("success","listing updated")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted")

    res.redirect("/listings")
}
