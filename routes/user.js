const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signupUser));

router.get("/login",userController.loginUser)

router.post("/login", saveRedirectUrl, (req, res, next) => {
    console.log("Login attempt for user:", req.body.username);
    
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password",
    }, (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            return next(err);
        }
        
        if (!user) {
            console.log("Authentication failed for user:", req.body.username);
            return res.redirect("/login");
        }
        
        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            
            console.log("User logged in successfully:", user.username);
            
            // Check if a success message already exists
            if (!req.session.flash || !req.session.flash.success) {
                req.flash("success", "Welcome back to GetYourStay!");
            }
            
            let redirectUrl = res.locals.redirectUrl || "/listing";
            res.redirect(redirectUrl);
        });
    })(req, res, next);
});
 

router.get("/logout",userController.logoutUser)

module.exports = router;