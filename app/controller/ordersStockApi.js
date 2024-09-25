const dbOrdersStockManager = require('../db/dbOrdersStockManager')
const express = require('express')
const router = express.Router()


/*
Get All OrdersInStock
path '/ordersStock/'
return  all products 
Failed 500
success 201
*/
router.get('/supplier/:supplierId', dbOrdersStockManager.getProductsBySupplierId);

/*
Get All OrdersInStock
path '/ordersStock/'
return  all products 
Failed 500
success 201
*/
router.get('/product/:productId', dbOrdersStockManager.getProductsByProductId);
/*
Get All OrdersInStock
path '/ordersStock/'
return  all products 
Failed 500
success 201
*/
router.get('/:orderId', dbOrdersStockManager.getProductsByOrderId);

/*
Get All OrdersInStock
path '/ordersStock/'
return  all products 
Failed 500
success 201
*/
router.get('/', dbOrdersStockManager.getOrdersStock);


module.exports = router;