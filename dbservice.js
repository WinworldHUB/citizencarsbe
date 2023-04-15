const data = require('./queries.json');
const mysql = require('mysql2');

const dbPool = mysql.createPool({
  database: 'defaultdb',
  host: 'db-mysql-blr1-2025-do-user-13812577-0.b.db.ondigitalocean.com',
  user: 'doadmin',
  password: 'AVNS_gy9QpHby2yOCqr7w802',
  port: 25060,
  connectTimeout: 20000,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
});

const dbService = {
  authenticateUser: (username, password, onCallback) => {
    dbPool.query(data.login, [username, password], (err, result) => {
      if (err) console.log(err);
      if (result) {
        console.log(result);
        if (result && result.length > 0) {
          onCallback({ status: 'success', data: result[0] });
        } else {
          onCallback({ status: 'failed', data: 'Invalid credentials' });
        }
      }
    });
  },
  registerUser: (name, phone, username, password, onCallback) => {
    dbPool.query(
      data.register,
      [username, password, name, phone],
      (err, result) => {
        if (err) console.log(err);
        if (result) {
          console.log(result);
          if (result && result.affectedRows > 0) {
            onCallback({ status: 'success', data: result[0] });
          } else {
            onCallback({ status: 'failed', data: 'Invalid credentials' });
          }
        }
      }
    );
  },
};

module.exports = dbService;
