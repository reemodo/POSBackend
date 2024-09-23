const db = require( './databaseConnection');
let nextOrdersStockId = 32;

const getOrdersStock = (request, response) => {
    db.query('SELECT * FROM ordersstock ORDER BY orderstockid ASC', (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).send('Error retrieving users');
        return;
      }
      console.log('Query results:', results.rows); // Debugging
      response.status(200).json(results.rows);
    });
};

const getProductsByOrderId = (request, response) => {
  const orderId = request.params.orderId

  if (isNaN(orderId)) {
    return response.status(400).send('Invalid order ID');
  }

  const query = 'SELECT * FROM ordersstock WHERE orderid = $1';

  db.query(query, [orderId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return response.status(500).send('Internal Server Error');
    }

    if (results.rows.length === 0) {
      return response.status(404).send('User not found');
    }

    response.status(200).json(results.rows[0]); // Only send the first row (product)
  });
};

const getProductsByProductId = (request, response) => {
    const productId = request.params.productId
  
    if (isNaN(productId)) {
      return response.status(400).send('Invalid product ID');
    }
  
    const query = 'SELECT * FROM ordersstock WHERE productid = $1';
  
    db.query(query, [productId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return response.status(500).send('Internal Server Error');
      }
  
      if (results.rows.length === 0) {
        return response.status(404).send('User not found');
      }
  
      response.status(200).json(results.rows[0]); // Only send the first row (product)
    });
  };

const getProductsBySupplierId = (request, response) => {
    const supplierId = request.params.supplierId
  
    if (isNaN(supplierId)) {
      return response.status(400).send('Invalid product ID');
    }
  
    const query = 'SELECT * FROM ordersstock WHERE supplierid = $1';
  
    db.query(query, [supplierId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return response.status(500).send('Internal Server Error');
      }
  
      if (results.rows.length === 0) {
        return response.status(404).send('User not found');
      }
  
      response.status(200).json(results.rows[0]); // Only send the first row (product)
    });
  };

  const addProductToOrdersStock = async (product) => {
    const {
      productid,
      productname,
      quantityordered,
      unitprice,
      discount,
      supplierid,
      selectedcolor,
      selectedsize,
      price,
      status,
      expirydate,
      barcode,
      type,
      orderdate
    } = product;
  
    const orderstockid = nextOrdersStockId++;
  
    // Create a query object to store column names and values dynamically
    const query = {
      text: `
        INSERT INTO public.ordersstock (
          orderstockid, productid, productname, quantityordered, unitprice, discount, supplierid, selectedcolor,
          selectedsize, price, status, expirydate, barcode, type, orderdate
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING productid;
      `,
      values: [
        orderstockid,
        productid,
        productname,
        quantityordered,
        unitprice,
        discount,
        supplierid,
        selectedcolor,
        selectedsize,
        price,
        status,
        expirydate ? new Date(expirydate).toISOString().split('T')[0] : null, // Ensure correct date format
        barcode,
        type,
        new Date(orderdate).toISOString().split('T')[0] // Ensure correct date format
      ],
    };
  
    try {
      // Execute the query
      const results = await db.query(query);
      const newProductId = results.rows[0].productid;
      return newProductId; // Return the new product ID after successful insertion
    } catch (error) {
      console.error("Error adding product to order stock:", error);
      throw error; // Throw the error to be handled by the caller
    }
  };
  

module.exports = { getOrdersStock, getProductsByOrderId, getProductsByProductId, getProductsBySupplierId, addProductToOrdersStock };