const User=require("../models/user");

module.exports.Signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser = new User({email,username});
        const registerUser = await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wonderlust!!");
            res.redirect("/listings");
        })
        // console.log(registerUser);
       
    }
    catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    }

module.exports.renderLogin=(req,res)=>{
    res.render("user/login.ejs")
}

module.exports.renderSignUp=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.login= async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings"; // this or condition b'cos when user on all listings page and then it login then come on all listings page if we not store this /listings then there is see an error b'coz res.locals.redirectUrl not contain path of all listings.
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(error);
        }
        req.flash("success","you logged out!");
        res.redirect("/listings");
    })
}