const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();

admin.initializeApp();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use('/functions', routes);

exports.app = functions.https.onRequest(app);
