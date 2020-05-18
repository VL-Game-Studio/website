require('dotenv').config();
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../routes');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.serviceAccount)),
  databaseURL: process.env.databaseURL,
});
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(routes);

module.exports = app;
