const dbOrderManager = require('../db/dbOrdersManager')
const express = require('express')
const router = express.Router()


/*
Get order by Id
path '/orders/id'
Failed 500
Not Found 404
success 200
*/
router.get('/:id', dbOrderManager.getOrderById);

/*
Get order by CustomerId
path '/orders/id'
Failed 500
Not Found 404
success 200
*/
router.get('/customer/:customerId', dbOrderManager.getOrderByCustomerId);

/*
PUT order by Id
path '/orders/id'
return  new data of the order 
Failed 500
Not Found 404
success 200
*/
router.put('/:id', dbOrderManager.updateOrder);
/*
POST  Order
path '/orders/'
return  NEW order id
Failed 500
Not Found 404
success 200
*/
router.post('/', dbOrderManager.addOrder);
/*
Get All orders
path '/orders/'
return  all orders 
Failed 500
success 201
*/
router.get('/', dbOrderManager.getOrders);

module.exports = router;