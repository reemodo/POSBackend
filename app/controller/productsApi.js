const dbProductsManager = require('../db/dbProductsManager')
const express = require('express')
const router = express.Router()

/*
Get Product by Id
path '/products/id'
return  product data :  productid, barcode, name, description, quantityperunit, price, category, 
color, size, imageurl, note, product_available, createddate, updateddate
Failed 500
Not Found 404
success 200
*/
router.get('/',  dbProductsManager.getProduct);
/*
PUT Product by Id
path '/products/id'
return  new data of the product 
Failed 500
Not Found 404
success 200
*/
router.put('/:id', dbProductsManager.updateProduct);
/*
POST  Product
path '/products/'
return  NEW product id
Failed 500
Not Found 404
success 200
*/
router.post('/', dbProductsManager.addProduct);
/*
Get All Products or by userInput
path '/products/'
return  all products 
Failed 500
success 201
*/
router.get('/', dbProductsManager.getProducts);


module.exports = router;