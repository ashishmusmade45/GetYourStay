const User = require("../Models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signupUser = async(req,res,next)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);    
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to GetYourStay");
        res.redirect("/listing");
    })
    
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.loginUser = (req,res)=>{
    res.render("user/login.ejs");
    
}


module.exports.logoutUser = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listing");
    })
}