if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./Models/user.js");


const sessionOptions = {
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{   
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//app.get("/demouser",async(req,res)=>{
//  let fakeuser = new User({
//    email:"Stud@123",
//  username:"Delta-stud",
//    });
//   let registerdUser = await User.register(fakeuser,"hello");
//   res.send(registerdUser);
//})


//Router
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");
const { register } = require("module");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

// Replace this with your MongoDB Atlas connection string
// Example: const MONGO_URL = "mongodb+srv://username:password@cluster.mongodb.net/wanderlust?retryWrites=true&w=majority";
const MONGO_URL = "mongodb+srv://Ashish:Ashish%4045@cluster0.qj5dpfy.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("Database connection error:", err);
}); 

async function main() {
  await mongoose.connect(MONGO_URL, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  });
}

app.get("/listings",wrapAsync(async (req,res)=>{
    await Listing.find({}).then(res => {
        console.log(res);
    });
}));



app.use("/listing",listing);
app.use("/listing/:id/review",review)
app.use("/",user);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
}); 

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("\listings/error.ejs",{message} )
    //res.status(statusCode).send(message);  
})

app.listen(8080,() =>{
    console.log("Server is listening to port 8080");
});