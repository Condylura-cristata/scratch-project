const { Pool } = require('pg');

const PG_URI = 'postgres://dcojxlzj:y6Zo1rU7PKqISk9OcawOurPBczF2_IOZ@ruby.db.elephantsql.com/dcojxlzj';

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};