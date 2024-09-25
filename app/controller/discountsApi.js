const dbDiscountManager = require('../db/dbDiscountManager')
const express = require('express')
const router = express.Router()

router.get('/:id', dbDiscountManager.getDiscountsById);
router.get('/product/:productId', dbDiscountManager.getDiscountsByProductId);
router.post('/',dbDiscountManager.insertDiscount)
router.get('/', dbDiscountManager.getDiscounts);



module.exports = router;