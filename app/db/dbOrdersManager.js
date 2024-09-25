const db = require("./databaseConnection");
const dbOrdersStockManager = require("./dbOrdersStockManager");
let nextOrderId = 62;

const getOrders = (request, response) => {
  db.query("SELECT * FROM orders ORDER BY orderid ASC", (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);
      response.status(500).send("Error retrieving users");
      return;
    }
    console.log("Query results:", results.rows); // Debugging
    response.status(200).json(results.rows);
  });
};

const getOrderById = (request, response) => {
  const orderId = request.params.id;

  if (isNaN(orderId)) {
    return response.status(400).send("Invalid order ID");
  }

  const query = "SELECT * FROM orders WHERE orderid = $1";

  db.query(query, [orderId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return response.status(500).send("Internal Server Error");
    }

    if (results.rows.length === 0) {
      return response.status(404).send("User not found");
    }

    response.status(200).json(results.rows[0]); // Only send the first row (product)
  });
};

const getOrderByCustomerId = (request, response) => {
  const customerId = request.params.customerId;

  if (isNaN(customerId)) {
    return response.status(400).send("Invalid order ID");
  }

  const query = "SELECT * FROM orders WHERE customerid = $1";

  db.query(query, [customerId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return response.status(500).send("Internal Server Error");
    }

    if (results.rows.length === 0) {
      return response.status(404).send("User not found");
    }

    response.status(200).json(results.rows); // Only send the first row (product)
  });
};

//there is contraints on role should be "customer, supplier, admin, employee"
const updateOrder = (request, response) => {
  const orderId = parseInt(request.params.id, 10); // Assuming ID is in request params
  const dataToUpdate = Object.values(request.body);

  // Construct the update query with placeholders for values
  const query = `
  UPDATE public.orders
  SET
    ${dataToUpdate
      .map((_, index) => `${Object.keys(request.body)[index]} = $${index + 1}`)
      .join(",")}
  WHERE orderid = $${dataToUpdate.length + 1}
  `;

  // Prepare the values for the query
  const values = [...dataToUpdate, orderId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating order:", error);
      response.status(500).send("Error updating order");
      return;
    }

    if (results.rowCount === 0) {
      response.status(404).send("Order not found");
      return;
    }

    response.status(200).send("Order updated successfully");
  });
};

const addOrder = async (request, response) => {
  const {customerid, customername, discount, ordernumber, orderdate, salestax, price, paymentmethod, paymentdate, status, type, note, printed,products
  } = request.body; // products is an array of products for this order

  try {
    // Insert into orders table
    const orderQuery = `
      INSERT INTO public.orders (customerid, customername, discount, ordernumber, orderdate, salestax, price,
        paymentmethod, paymentdate, status, type, note, printed, orderid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING orderid, orderdate;
    `;

    const orderValues = [
      customerid,
      customername,
      discount,
      ordernumber,
      orderdate,
      salestax ,
      price,
      paymentmethod,
      paymentdate,
      status,
      type,
      note,
      printed,
    ];
    const orderResult = await db.query(orderQuery, [...orderValues, nextOrderId ++ ]);
    const newOrderId = orderResult.rows[0].orderid;

    // Insert products into productsstock
    for (let product of products) {
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
        orderdate,
        status,
        expirydate,
        barcode,
        type,
      } = product;
      // Add the orderstockid or link it with the newly created order (newOrderId)
      const productWithOrderId = {
        ...product,
        orderstockid: newOrderId, // Assuming orderstockid relates to the order id
        orderdate
      };

      // Await the addition of each product
      await dbOrdersStockManager.addProductToOrdersStock(productWithOrderId);
    }

    response
      .status(201)
      .json({
        message: "Order and products added successfully",
        orderId: newOrderId,
      });
  } catch (error) {
    console.error("Error adding order and products:", error);
    response.      status(500).send("Error adding order and products");
  } 
};

const deleteOrderById = (request, response) => {
  const userId = parseInt(request.params.id, 10); // Assuming ID is in request params

  const query = "DELETE FROM public.orders WHERE orderid = $1";

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error deleting order:", error);
      response.status(500).send("Error deleting order");
      return;
    }

    if (results.rowCount === 0) {
      response.status(404).send("Order not found");
      return;
    }

    response.status(200).send("Order deleted successfully");
  });
};

module.exports = {
  getOrders,
  getOrderById,
  getOrderByCustomerId,
  addOrder,
  updateOrder,
  deleteOrderById,
};
