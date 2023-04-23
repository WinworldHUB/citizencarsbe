const express = require('express');
const cors = require('cors');
const dbService = require('./dbservice');

const port = 8080;

const app = express();
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

app.use(express.Router({ mergeParams: true }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  dbService.authenticateUser(
    req.body.username ?? '',
    req.body.password ?? '',
    (result) => {
      console.log(result);
      res.json(result);
    }
  );
});

app.post('/register', (req, res) => {
  dbService.registerUser(
    req.body.name ?? '',
    req.body.phone ?? '',
    req.body.username ?? '',
    req.body.password ?? '',
    (result) => {
      res.json(result);
    }
  );
});

app.post('/upload', (req, res) => {
  dbService.uploadData(req.body);
  res.json(req.body);
});

app.get('/totalcars', (req, res) => {
  dbService.getTotalCars((result) => {
    res.json(result);
  });
});

app.get('/cars', (req, res) => {
  const pageStart = req.body.pageStart ?? 0;
  const numberOfRecords = req.body.numberOfRecords ?? 10;
  dbService.getCars(pageStart, numberOfRecords, (result) => {
    res.json(result);
  });
});

app.get('/car/:SrNo', (req, res) => {
  const carSrNo = req.params.SrNo ?? 0;

  dbService.getCar(carSrNo, (result) => {
    console.log(result);
    res.json(result);
  });
});

app.post('/addtowishlist', (req, res) => {
  const userId = req.body.userId ?? 0;
  const carId = req.body.carId ?? 0;

  console.log(req.body);
  dbService.addToWishList(userId, carId, (result) => {
    console.log(result);
    res.json(result);
  });
});

app.get('/getmywishlist/:userId', (req, res) => {
  const userId = req.params.userId ?? 0;

  dbService.getMyWishList(userId, (result) => {
    console.log(result);
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
