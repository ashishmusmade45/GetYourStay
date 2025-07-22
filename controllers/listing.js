const Listing = require("../Models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index 
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    console.log('Total listings in database:', allListings.length);
    if (allListings.length > 0) {
        console.log('Sample listing data:', {
            title: allListings[0].title,
            country: allListings[0].country,
            location: allListings[0].location
        });
    }
    res.render("\listings/index.ejs",{allListings});
}

//New
module.exports.newListing = (req,res)=>{
    res.render("\listings/new.ejs");
}

//Show
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"},})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing Not Exist");
        res.redirect("/listing");
    }
    res.render("\listings/show.ejs",{listing});
}

//Create
module.exports.createListing =async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
}

//Edit
module.exports.editListing =async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let originalImageurl = listing.image.url;
    originalImageurl = originalImageurl.replace("/uplaod","/upload/ w_250")
    res.render("\listings/edit.ejs",{listing,originalImageurl});
}

//Update
module.exports.updateListing =async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image ={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`); 
}
 
//Delete
module.exports.deleteListing =async(req,res)=>{
    let {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
}

// Search 
module.exports.searchCategory = async (req, res) => {
    const { search } = req.query;
    
    try {
        console.log('Search query received:', search); // Debug log
        
        let searchQuery = {};
        
        // Search by country or city (case-insensitive)
        if (search && search.trim()) {
            const searchTerm = search.trim();
            searchQuery.$or = [
                { country: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } }
            ];
            console.log('Search query:', JSON.stringify(searchQuery)); // Debug log
        }
        
        // If no search parameters provided, return all listings
        if (Object.keys(searchQuery).length === 0) {
            const allListings = await Listing.find({});
            console.log('No search term, returning all listings:', allListings.length); // Debug log
            return res.render('listings/search.ejs', { 
                allListings, 
                searchTerm: '',
                totalResults: allListings.length,
                hasFilters: false
            });
        }
        
        // Execute search
        const allListings = await Listing.find(searchQuery);
        console.log('Search results found:', allListings.length); // Debug log
        
        // Debug: Log the first few results to see their structure
        if (allListings.length > 0) {
            console.log('First result:', {
                title: allListings[0].title,
                country: allListings[0].country,
                location: allListings[0].location
            });
        }
        
        res.render('listings/search.ejs', { 
            allListings, 
            searchTerm: search,
            totalResults: allListings.length,
            hasFilters: true
        });
        
    } catch (error) {
        console.error('Search error:', error);
        req.flash('error', 'Something went wrong while searching.');
        res.redirect('/listing');
    }
};

