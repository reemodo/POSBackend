const db = require( './databaseConnection');

// Insert inventory transaction function
const insertInventoryTransaction = async (
    inventoryOrderId, orderId, transactionType, supplierId, customerId, price, transactionDate, crdb
  ) => {
    const query = `
      INSERT INTO public.inventorytransaction(
        inventoryorderid, orderid, transactiontype, supplierid, customerid, price, transactiondate, crdb)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [
        inventoryOrderId, orderId, transactionType, supplierId, customerId, price, transactionDate, crdb
      ]);
      console.log('Inventory transaction inserted:', result.rows[0]);
    } catch (error) {
      console.error('Error inserting inventory transaction:', error);
    }
  };
// Get inventory transaction by inventoryOrderId function
const getInventoryTransactionById = async (inventoryOrderId) => {
    const query = `SELECT * FROM public.inventorytransaction WHERE inventoryorderid = $1;`;
  
    try {
      const result = await pool.query(query, [inventoryOrderId]);
      if (result.rows.length > 0) {
        console.log('Inventory transaction found:', result.rows[0]);
      } else {
        console.log('No inventory transaction found with the given ID.');
      }
    } catch (error) {
      console.error('Error retrieving inventory transaction:', error);
    }
  };

  const getInventoryTransactionsByDateRange = async (startDate, endDate) => {
    const query = `
      SELECT * FROM public.inventorytransaction
      WHERE transactiondate BETWEEN $1 AND $2;
    `;
  
    try {
      const result = await pool.query(query, [startDate, endDate]);
      if (result.rows.length > 0) {
        console.log('Inventory transactions found:', result.rows);
      } else {
        console.log('No inventory transactions found in the given date range.');
      }
    } catch (error) {
      console.error('Error retrieving inventory transactions by date range:', error);
    }
  };

  const getInventoryTransactionsByDate = async (specificDate) => {
    const query = `
      SELECT * FROM public.inventorytransaction
      WHERE transactiondate = $1;
    `;
  
    try {
      const result = await pool.query(query, [specificDate]);
      if (result.rows.length > 0) {
        console.log('Inventory transactions on specific date:', result.rows);
      } else {
        console.log('No inventory transactions found on the given date.');
      }
    } catch (error) {
      console.error('Error retrieving inventory transactions by specific date:', error);
    }
  };
  module.exports = { insertInventoryTransaction, getInventoryTransactionsByDateRange };
