const db = require( './databaseConnection');
let nextUserId = 2;
const getUsers = (request, response) => {
    db.query('SELECT * FROM users ORDER BY userid ASC', (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).send('Error retrieving users');
        return;
      }
      console.log('Query results:', results.rows); // Debugging
      response.status(200).json(results.rows);
    });
};

const getUser = (request, response) => {
  const userId = request.params.id

  if (isNaN(userId)) {
    return response.status(400).send('Invalid user ID');
  }

  const query = 'SELECT * FROM users WHERE userid = $1';

  db.query(query, [userId],  (error, results) => {
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

//there is contraints on role should be "customer, supplier, admin, employee"
const updateUser = (request, response) => {
  const userId = parseInt(request.params.id, 10); // Assuming ID is in request params
  const dataToUpdate = Object.values(request.body); 

  // Construct the update query with placeholders for values
  const query = `
  UPDATE public.users
  SET
    ${dataToUpdate.map((_, index) => `${Object.keys(request.body)[index]} = $${index + 1}`).join(',')}
  WHERE userid = $${dataToUpdate.length + 1}
  `;

  // Prepare the values for the query
  const values = [...dataToUpdate, userId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating user:', error);
      response.status(500).send('Error updating user');
      return;
    }

    if (results.rowCount === 0) {
      response.status(404).send('User not found');
      return;
    }

    response.status(200).send('User updated successfully');
  });
};

const addUser = (request, response) => {
  const { name, role, companyName, city, phone, fax, email, url, logourl, activestatus } = request.body;
  const userID = nextUserId++;
  const query = `
    INSERT INTO public.users (name, role, companyName, city, phone, fax, email, url, logourl, activestatus, userid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING userid;
  `;

  const values = [name, role, companyName, city, phone, fax, email, url, logourl, activestatus, userID];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error adding user:', error);
      response.status(500).send('Error adding User');
      return;
    }

    const newUserId = results.rows[0].userid;
    response.status(201).json({ message: 'User added successfully', userId: newUserId });
  });
};

const deleteUser = (request, response) => {
  const userId = parseInt(request.params.id, 10); // Assuming ID is in request params

  const query = 'DELETE FROM public.users WHERE userid = $1';

  db.query(query, [userId], (error, results) => {
      if (error) {
      console.error('Error deleting user:', error);
      response.status(500).send('Error deleting user');
      return;
      }

      if (results.rowCount === 0) {
      response.status(404).send('User not found');
      return;
      }

      response.status(200).send('User deleted successfully');
  });
};

module.exports = { getUsers, getUser, addUser, updateUser, deleteUser };
  