import express from 'express';
// import data from './data.js';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js'


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

app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
  });
  
app.use('/api/seed', seedRouter);

// Backend API for products
app.use('/api/products', productRouter);

// Api for users
app.use('/api/users', userRouter);

// Api for orders
app.use('/api/orders', orderRouter);


const __dirname = path.resolve();  // Returns the current directory - need to import path from 'path'
app.use(express.static(path.join(__dirname, '/frontend/build'))); // This middleware serves all files in the frontend/build folder as static files
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))  // * - represents every thing the user enters after the domain name (eg. localhost:3000) should be served by index.html
);                                                                  // there is no build folder in the frontend folder. We have added to create one in bmart/package.json "scrpts": So,open terminal, go to bmart root folder and type $ npm run build

app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);


//when there is an error in userRouter async function this error will be triggered
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
  });

const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`Serve at http://localhost:${port}`);
})