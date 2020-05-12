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
app.use(cors(/*{ origin: 'https://videre.live' }*/));
app.use('/functions', routes);

/*
  function enroll(name, decklist, platform) {
    //Adds player and deck to league, fires if quota is met.
  }

  exports.enroll = functions.database.ref('/decklists/{decklistID}').onCreate(snapshot => {
    const { name, decklist, platform } = snapshot.val();

    return enroll(name, decklist, platform);
  });
*/

exports.app = functions.https.onRequest(app);
