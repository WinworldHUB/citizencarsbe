const queries = require('./queries.json');
const mysql = require('mysql2');

const SUCCESS = 'success';
const FAILURE = 'failure';

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
  getUser: (username, onCallback) => {
    dbPool.query(queries.getUser, [username], (err, result) => {
      if (err) console.log(err);
      if (result) {
        console.log(result);
        if (result.length > 0) {
          onCallback({ status: SUCCESS, data: result[0] });
        } else {
          onCallback({ status: FAILURE, data: 'User not found or not active' });
        }
      }
    });
  },

  authenticateUser: (username, password, onCallback) => {
    dbService.getUser(username, (result) => {
      if (result.status === SUCCESS && result.data.password === password) {
        onCallback({
          status: SUCCESS,
          data: { id: result.data.id, role: result.data.role },
        });
      } else {
        onCallback({ status: FAILURE, data: 'Invalid credentials' });
      }
    });
  },

  registerUser: (name, phone, username, password, onCallback) => {
    dbService.getUser(username, (userQueryResult) => {
      if (userQueryResult.status === SUCCESS) {
        onCallback({ status: FAILURE, data: 'User already exists' });
      } else {
        dbPool.query(
          queries.register,
          [username, password, name, phone],
          (err, result) => {
            if (err) console.log(err);
            if (result) {
              console.log(result);
              if (result.affectedRows > 0) {
                onCallback({ status: SUCCESS, data: result[0] });
              } else {
                onCallback({
                  status: FAILURE,
                  data: 'Invalid credentials',
                });
              }
            }
          }
        );
      }
    });
  },

  uploadData: (dataRows = { columns: [], values: [] }) => {
    let query = `${queries.upload} (`;

    dataRows.columns.forEach((column) => (query += `\`${column}\`, `));

    query += ') VALUES ?';
    query = query.replace(', )', ')');

    dbPool.query(query, [dataRows.values], (err, result) => {
      if (err) console.log(err);

      if (result) {
        console.log(result);
        if (result.affectedRows > 0) {
          //onCallback({ status: 'success', data: result });
        } else {
          // onCallback({
          //   status: 'failed',
          //   data: 'Invalid credentials',
          // });
        }
      }
    });
  },

  getTotalCars: (onCallback) => {
    dbPool.query(queries.getTotalCars, null, (err, result) => {
      if (err) console.log(err);

      if (result && result.length > 0) {
        onCallback({ status: SUCCESS, data: result[0] });
      } else {
        onCallback({
          status: FAILURE,
          data: 'No cars found',
        });
      }
    });
  },

  getCar: (SrNo, onCallback) => {
    dbPool.query(queries.getCar, [SrNo], (err, result) => {
      if (err) console.log(err);

      if (result && result.length > 0) {
        onCallback({ status: SUCCESS, data: result[0] });
      } else {
        onCallback({
          status: FAILURE,
          data: 'No cars found',
        });
      }
    });
  },

  getCars: (pageStart, numberOfRecords, onCallback) => {
    dbService.getTotalCars((totalCars) => {
      if (totalCars.status === SUCCESS) {
        if (totalCars.data.totalCars > 0) {
          const calculatedPageStart =
            pageStart < totalCars.data.totalCars
              ? pageStart
              : totalCars.data.totalCars - numberOfRecords - 1;
          dbPool.query(
            queries.getCars,
            [calculatedPageStart, numberOfRecords],
            (err, result) => {
              if (err) console.log(err);

              if (result) {
                console.log(result);
                if (result.length > 0) {
                  onCallback({ status: SUCCESS, data: result });
                } else {
                  onCallback({
                    status: FAILURE,
                    data: 'No cars found',
                  });
                }
              }
            }
          );
        } else {
          onCallback({
            status: FAILURE,
            data: 'No cars found',
          });
        }
      } else {
        onCallback({
          status: FAILURE,
          data: 'Invalid request',
        });
      }
    });
  },

  isCarInWishList: (userId, carId, onCallback) => {
    const executedQuery = dbPool.query(
      queries.isCarInWishList,
      [userId, carId],
      (err, result) => {
        if (err) console.log(err);

        if (result && result.length > 0) {
          onCallback({ status: SUCCESS, data: result[0] });
        } else {
          onCallback({
            status: FAILURE,
            data: 'Unable to add to wishlist',
          });
        }
      }
    );

    //console.log(executedQuery);
  },

  addToWishList: (userId, carId, onCallback) => {
    const executedQuery = dbService.isCarInWishList(
      userId,
      carId,
      (response) => {
        console.log(response);
        if (response.status === FAILURE) {
          dbPool.query(
            queries.addToWishList,
            [userId, carId],
            (err, result) => {
              if (err) console.log(err);

              console.log(result);

              if (result) {
                onCallback({ status: SUCCESS, data: result[0] });
              } else {
                onCallback({
                  status: FAILURE,
                  data: 'Unable to add to wishlist',
                });
              }
            }
          );
        } else {
          onCallback(response);
        }
      }
    );

    //console.log(executedQuery);
  },

  getMyWishList: (userId, onCallback) => {
    const executedQuery = dbPool.query(
      queries.getMyWishList,
      [userId],
      (err, result) => {
        if (err) console.log(err);

        if (result && result.length > 0) {
          onCallback({ status: SUCCESS, data: result });
        } else {
          onCallback({
            status: FAILURE,
            data: 'Your wishlist is empty',
          });
        }
      }
    );

    //console.log(executedQuery);
  },
};

module.exports = dbService;
