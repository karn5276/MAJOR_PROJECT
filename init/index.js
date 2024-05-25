const mongoose = require("mongoose");
const Listing = require("../models/listings"); // here Listing is an collection.
const initdata = require("./data.js");

main().then(()=>{
    console.log("conneted to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

async function initDB(){
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,owner:"653033b85d57f6837514d5f7"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialzed");
}

initDB();