import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';


// To fetch the variables in the .env file
dotenv.config();

// Connect to mongodb database - here MONGODB_URI is the variable in .env where connection string is stored.
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log(err.message);
});

const app = express();

//The following two lines of code will convert form data in the post request into json object inside req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);

// Backend API for products
app.use('/api/products', productRouter);

// Api for users
app.use('/api/users', userRouter);


const port = process.env.PORT || 5000;

//when there is an error in userRouter async function this error will be triggered
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
  });

app.listen(port, ()=> {
    console.log(`Serve at http://localhost:${port}`);
})