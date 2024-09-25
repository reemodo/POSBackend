const dbCategoryManager = require('../db/dbCategoryManager')
const express = require('express')
const router = express.Router()

router.get('/', dbCategoryManager.getCategories);
router.post('/', dbCategoryManager.getDiscountsById);
router.get('/', dbCategoryManager.getDiscounts);


module.exports = router;