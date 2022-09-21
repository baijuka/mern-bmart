//Need to use Router() function of express, so import express
import express from 'express';
//Need to add .js after the productModel and data files
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

// define get api on the seedRouter using get function. Then remove all previous data in the Product model
// Then import data from data.js
seedRouter.get('/', async (req, res) => {
    await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    // res.send({createdProducts});

    //Get api for fetching data from user model
    await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdProducts, createdUsers });
});

export default seedRouter;