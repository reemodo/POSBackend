const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const path = require("path");
const usersApi = require("./controller/usersApi");
const productsApi = require("./controller/productsApi")
const ordersApi = require("./controller/ordersApi")
const ordersStockApi = require("./controller/ordersStockApi")
const discountApi = require("./controller/discountsApi")
const cors = require('cors')
// Use CORS middleware
app.use(cors()); // This enables CORS for all routes
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))


app.use('/users', usersApi)
app.use('/products', productsApi)
app.use('/orders', ordersApi)
app.use('/ordersStock', ordersStockApi)
app.use('/discounts', discountApi)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
  })