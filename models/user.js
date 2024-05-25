const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});

// here we are not write username and password in schema b'coz it directly do that , this passport package.

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);
module.exports=User;