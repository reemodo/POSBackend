const db = require( './databaseConnection');
let nextOrderId = 1;

const getDiscounts = (request, response) => {
    db.query('SELECT * FROM discount order BY discountid ASC', (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).send('Error retrieving users');
        return;
      }
      console.log('Query results:', results.rows); // Debugging
      response.status(200).json(results.rows);
    });
};
const getDiscountsById = (request, response) => {
    const discountId = request.params.id
    const query = 'SELECT * FROM discount where discountid = $1'
    db.query(query,[discountId], (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).send('Error retrieving users');
        return;
      }
      console.log('Query results:', results.rows); // Debugging
      response.status(200).json(results.rows);
    });
};
const getDiscountsByProductId = (request, response) => {
  const productId = request.params.productId;
  // Use parameterized query to prevent SQL injection
  const query = `
    SELECT discountid, products_discount, offer_name, startdate, enddate, condition, discount, usageforcustmer
    FROM discount
    WHERE 
      EXISTS (
          SELECT 1
          FROM unnest(products_discount) AS pd
          WHERE pd.productid = $1
      ) AND
      startdate <= NOW() AND
      enddate >= NOW()
  `;
  
  // Execute the query with parameterized input
  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error('Error executing query', error.stack);
      response.status(500).send('Error retrieving discounts');
      return;
    }
    console.log('Query results:', results.rows); // Debugging
    response.status(200).json(results.rows);
  });
};

const printQuery = (query, values) => {
  let formattedQuery = query;
  values.forEach((value, index) => {
    const placeholder = `$${index + 1}`;
    const valueToInsert = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
    formattedQuery = formattedQuery.replace(placeholder, valueToInsert);
  });
  return formattedQuery;
};

const insertDiscount = async (req, res) => {
  const {
    discountId,
    productsDiscount,
    productName,
    offer,
    startDate,
    endDate,
    userId,
    condition,
    offerName,
    createdDate,
    updatedDate,
    usageForCustomer
  } = req.body;

  const query = `
    INSERT INTO public.discount(
      discountid, products_discount, productname, offer, startdate, enddate, userid, condition, offer_name, createddate, updateddate, usageforcustmer
    ) VALUES (
      $1, 
      $2, 
      $3, 
      $4, 
      $5, 
      $6, 
      $7, 
      $8, 
      $9, 
      $10, 
      $11, 
      $12
    ) RETURNING *;
  `;

  const formattedProductsDiscount = productsDiscount.map(
    item => `"(${item.productid}, ${item.amount}, ${item.discountamount})"`
  ).join(', ');

  // Wrap with curly braces for PostgreSQL array format
  const formattedProductsDiscountArray = `{${formattedProductsDiscount}}`;



  const values = [
    discountId,
    formattedProductsDiscountArray,
    productName,
    offer,
    startDate,
    endDate,
    userId,
    condition,
    offerName,
    createdDate,
    updatedDate,
    usageForCustomer
  ];

  console.log('Query:', printQuery(query, values)); // Print the query for debugging

  try {
    const result = await db.query(query, values);
    console.log('Discount inserted:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting discount:', error);
    res.status(500).json({ error: 'Error inserting discount' });
  }
};





module.exports = {getDiscountsById, getDiscounts , getDiscountsByProductId, insertDiscount};