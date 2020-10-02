const {Pool} = require("pg");

const pool = new Pool();

/**
 * Method for quering database
 * @param {string} text
 * Query text
 * @param {any[]} params
 * Query parameters
 * @returns {Promise<import("pg").QueryResult<*>>}
 */
exports.query = (text, params) => {
  return pool.query(text, params);
};

/**
 * Method for getting database connection
 * @returns {Promise<import('pg').PoolClient>}
 */
exports.getConnection = () => {
  return pool.connect();
};
