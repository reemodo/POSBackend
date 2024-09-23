const db = require( './databaseConnection');
let nextCategoryId = 1;

const getCategories = (request, response) => {
    db.query('SELECT * FROM category order BY categoryId ASC', (error, results) => {
      if (error) {
        console.error('Error executing query', error.stack);
        response.status(500).send('Error retrieving users');
        return;
      }
      console.log('Query results:', results.rows); // Debugging
      response.status(200).json(results.rows);
    });
};
// Insert category function
const insertCategory = async (request, response) => {
  const name = request.body.name
  const categoryId = nextCategoryId ++;
  const query = `INSERT INTO public.category(name, "categoryId") VALUES($1, $2) RETURNING *;`;
  
  try {
    const result = await db.query(query, [name, categoryId]);
    console.log('Category inserted:', result.rows[0]);
  } catch (error) {
    console.error('Error inserting category:', error);
  }
};


module.exports = { getCategories, insertCategory };