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
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  let whereAdded = false;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${whereAdded ? 'AND' : 'WHERE'} city LIKE $${queryParams.length} `;
    whereAdded = true;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `${whereAdded ? 'AND' : 'WHERE'} owner_id = $${queryParams.length} `;
    whereAdded = true;
  }

  // if both min and max are provided
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `${whereAdded ? 'AND' : 'WHERE'} (cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}) `;
    whereAdded = true;
  } else {
    // If only minimum_price_per_night is provided
    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `${whereAdded ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length} `;
      whereAdded = true;
    }

    // If only maximum_price_per_night is provided
    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `${whereAdded ? 'AND' : 'WHERE'} cost_per_night <= $${queryParams.length} `;
      whereAdded = true;
    }
  }

  queryString += `
    GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  console.log("Query:", queryString);
  console.log("Params:", queryParams);

  return pool.query(queryString, queryParams).then(res => res.rows).catch(err => {
    console.error("getAllProperties error:", err.message);
  });

};
/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  const queryString = `
    INSERT INTO properties (
      owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
      street, city, province, post_code, country, parking_spaces,
      number_of_bathrooms, number_of_bedrooms
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  return pool
    .query(queryString, queryParams)
    .then(result => result.rows[0])
    .catch(err => {
      console.error("addProperty error:", err.message);
    });
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
