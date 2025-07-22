const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloud-Config.js");
const upload = multer({storage});


// INDEX ROUTE
router.get("/",wrapAsync(listingController.index));

// NEW ROUTE
router.get("/new",isLoggedIn, listingController.newListing
);



// CREATE ROUTE
router.post("/",isLoggedIn, upload.single('listing[image]'),wrapAsync(listingController.createListing));


// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

// UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'), wrapAsync(listingController.updateListing));

// DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// Search

router.get("/search", wrapAsync(listingController.searchCategory));

// Test route to see database contents
router.get("/test/data", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.json({
            total: allListings.length,
            listings: allListings.map(listing => ({
                id: listing._id,
                title: listing.title,
                country: listing.country,
                location: listing.location
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SHOW ROUTE
router.get("/:id",wrapAsync(listingController.showListing));


module.exports = router;