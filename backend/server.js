import express from 'express';
import data from './data.js';

const app = express();

// Backend API for products

app.get('/api/products', (req, res) => {
    res.send(data.products);
});

// Backend API for a particular product

app.get('/api/products/slug/:slug', (req, res) => {

    const product = data.products.find((x) => x.slug === req.params.slug);
        if (product) {
            res.send(product)
        } else {
            res.status(404).send({message: 'Product not found'});
        }
    }
);

const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`Serve at http://localhost:${port}`);
})