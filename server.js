const express = require('express');
const cors = require ('cors');
const dbService = require('./dbservice');

const port = 8080;

const app = express();
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
    console.log(req);
    res.send('All good!');
});
 
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});