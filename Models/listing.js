const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
    
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
  },],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true,
    },
    coordinates:{
      type:[Number],
      required:true,
    },
  },
  category: {
    type: String,
    enum: [
      'Trending',
      'Rooms',
      'Cities',
      'Mountains',
      'Castles',
      'Amazing Pools',
      'Camping',
      'Arctic',
      'Farm'
    ],
    required:true,
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({reviews:{$in:listing.reviews}}); 
  }
  
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;