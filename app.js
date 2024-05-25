if(process.env.NODE_ENV!="production"){ 
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose=require("mongoose");
const path=require('path');
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter=require("./routes/listings.js");
const reviewRouter =require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const UserRouter=require("./routes/user.js");
const Listing=require("./models/listings.js");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600 // means update session information after 24 hours
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE : ",err)
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, // this is the expiry date of our cookie.
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate); // this is for boilerplate it is define layouts.
app.use(express.static(path.join(__dirname,"/public")));




main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

// middleware of flash
app.use((req,res,next)=>{
    // below are the locals variable which are used any where in the program.
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user; // this req.user contain login info of user when it logged in. this is access in navbar.ejs;

    next();
});


// demo user login

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });

//     let registerUser=await User.register(fakeuser,"helloworld");
//     res.send(registerUser);
// });

app.use("/",UserRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);



// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// });

app.post("/search",async(req,res)=>{
    let {search_name}=req.body;

    let allListings=await Listing.find({$text:{$search:search_name}});
    console.log(allListings);

    res.render("listings/index.ejs",{allListings})

   
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message}=err;
    // res.status(statusCode).send(message);
    // console.log("message == >",message);
    res.render("error.ejs",{message});
})



app.use((err,req,res,next)=>{
    res.send("something went wrong");
})

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});
