const express = require('express');
const volleyball = require('volleyball');
const auth = require('./auth');

const app = express();

const port = 5000;

app.use(volleyball);

app.get('/', (req, res) => {
  res.json({ message: 'Hello world👋' });
});

app.use('/auth', auth);

const notFound = (req, res, next) => {
  res.status(404);
  const err = new Error(`Not Found ${req.originalUrl}`);
  next(err);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500).json({
    message: err.message,
    stack: err.stack,
  });
};

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.dir(`Server started and listen for request on port ${port}.........`);
});
