import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
   {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
  },
//   The timestamps object will add two new fields in the database - createdat and updatedat
  {
    timestamps: true,
  } 
);

// create the model based on the schema

const Product = mongoose.model('Product',productSchema);
// Here the first parameter 'Product' is the name of the model.

export default Product;