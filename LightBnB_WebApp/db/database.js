const properties = require("./json/properties.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb"
});

/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  console.log("getUserWithEmail called with:", email);
  return pool
  .query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()])
  .then(result => {
    if (result.rows.length === 0) return null;
    return result.rows[0];
  })
  .catch(err => {
    console.error("getUserWithEmail error:", err.message);
  });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(result => {
      if (result.rows.length === 0) return null;
      return result.rows[0];
    })
    .catch(err => {
      console.error("getUserWithId error:", err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password } = user;
  console.log("addUser called with:", user);
  return pool
    .query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [name, email.toLowerCase(), password]
    )
    .then(result => result.rows[0])
    .catch(err => {
      console.error("addUser error:", err.message);
    });
};

/// Reservations
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  console.log("Fetching reservations for guest_id:", guest_id);
  return pool
  .query(
    `SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;`,
    [guest_id, limit]
  )
  .then(result => {
    console.log("Reservations query result:", result.rows);
    return result.rows;
  })
  .catch(err => {
    console.error("getAllReservations error:", err.message);
  });
};

/// Properties
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
