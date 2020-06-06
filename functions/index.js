require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.serviceAccount)),
    databaseURL: process.env.databaseURL,
  });
} else {
  admin.initializeApp();
}


app.use(helmet());
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use('/functions', routes);
} else {
  app.use(routes);
}

if (process.env.NODE_ENV === 'development') {
  console.info('Listening on port 8080.');
  app.listen(8080);
}

exports.app = functions.https.onRequest(app);
exports.server = app;
