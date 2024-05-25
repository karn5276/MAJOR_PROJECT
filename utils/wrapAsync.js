
module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
}

// this file we are created for avoiding try and catch block to reduce code complexity.