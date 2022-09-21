import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import seedRouter from './routes/seedRoute.js';
import productRouter from './routes/productRoutes.js';

// To fetch the variables in the .env file
dotenv.config();

// Connect to mongodb database - here MONGODB_URI is the variable in .env where connection string is stored.
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log(err.message);
});

const app = express();
app.use('/api/seed', seedRouter);

// Backend API for products
app.use('/api/products', productRouter);



const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`Serve at http://localhost:${port}`);
})