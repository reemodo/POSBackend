let nextProductId = 106;

const db = require( './databaseConnection');

const getProducts = (request, response) => {
    db.query('SELECT * FROM products', (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).send('Error retrieving users');
        return;
      }
      console.log('Query results:', results.rows); // Debugging
      response.status(200).json(results.rows);
    });
};
const getProduct = (request, response) => {
  const userInput = request.query.inputValue?.trim() || null;

  const query = 'SELECT * FROM search_products($1)'

  db.query(query, [userInput], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          return response.status(500).send('Internal Server Error');
      }

      console.log('Query results:', results.rows);

      if (results.rows.length === 0) {
          return response.status(404).send('Product not found');
      }

      response.status(200).json(results.rows);
  });
};

const getProductById = (request, response) => {
    // const productId = parseInt(request.id, 10); // Validate and convert ID to number
    const productId = request.params.id

    if (isNaN(productId)) {
      return response.status(400).send('Invalid product ID');
    }
  
    const query = 'SELECT * FROM products WHERE productid = $1';
  
    db.query(query, [productId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return response.status(500).send('Internal Server Error');
      }
  
      if (results.rows.length === 0) {
        return response.status(404).send('Product not found');
      }
  
      response.status(200).json(results.rows[0]); // Only send the first row (product)
    });
  };

const updateProduct = (request, response) => {
    const productId = parseInt(request.params.id, 10); // Assuming ID is in request params
    const dataToUpdate = Object.values(request.body); 
  
    // Construct the update query with placeholders for values
    const query = `
    UPDATE public.products
    SET
      ${dataToUpdate.map((_, index) => `${Object.keys(request.body)[index]} = $${index + 1}`).join(',')}
    WHERE productid = $${dataToUpdate.length + 1}
    `;
  
    // Prepare the values for the query
    const values = [...dataToUpdate, productId];
  
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error updating product:', error);
        response.status(500).send('Error updating product');
        return;
      }
  
      if (results.rowCount === 0) {
        response.status(404).send('Product not found');
        return;
      }
  
      response.status(200).send('Product updated successfully');
    });
};

const addProduct = (request, response) => {
    const { barcode, name, description, quantityperunit, price, category, color, size, imageurl, note } = request.body;
    const productId = nextProductId++;
    const query = `
      INSERT INTO public.products (barcode, productname, description, quantityperunit, price, category, color, size, imageurl, note, productid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING productid;
    `;
  
    const values = [barcode, name, description, quantityperunit, price, category, color, size, imageurl, note, productId];
  
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error adding product:', error);
        response.status(500).send('Error adding product');
        return;
      }
  
      const newProductId = results.rows[0].productid;
      response.status(201).json({ message: 'Product added successfully', productId: newProductId });
    });
  };

const deleteProduct = (request, response) => {
    const productId = parseInt(request.params.id, 10); // Assuming ID is in request params

    const query = 'DELETE FROM public.products WHERE productid = $1';

    db.query(query, [productId], (error, results) => {
        if (error) {
        console.error('Error deleting product:', error);
        response.status(500).send('Error deleting product');
        return;
        }

        if (results.rowCount === 0) {
        response.status(404).send('Product not found');
        return;
        }

        response.status(200).send('Product deleted successfully');
    });
};
  
module.exports = { getProducts, getProduct, deleteProduct, updateProduct, addProduct,getProductById };
  