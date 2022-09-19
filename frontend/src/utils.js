export const getError = (error) => {
    return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

// error.response.data.message is coming form backend server.js - code is given below 
// const product = data.products.find((x) => x.slug === req.params.slug);
// if (product) {
//     res.send(product)
// } else {
//     res.status(404).send({message: 'Product not found'});  --> This is the error assigned to error.response.data.message 
// when you enter a slug that is not in the data set will throw 'Product not found' error on the screen
// }