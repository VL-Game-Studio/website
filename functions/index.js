const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

admin.initializeApp();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: 'https://videre.codyb.co' }));

app.post('/functions/leagues/:platform', async (req, res) => {
  const { platform } = req.params;
  const { name, decklist } = req.body;

  try {
    await validateDecklist(decklist);
    await admin.database().ref('/decklists').push({ name, platform, decklist });

    return res.status(201).json({ message: 'Decklist submitted successfully' });
  } catch (error) {
    console.error(`POST /leagues/${platform} ({ name: ${name}, decklist: ${decklist} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'Decklist rejected' });
  }
});

app.post('/functions/leagues/:league/:platform', async (req, res) => {
  const { league, platform } = req.params;
  const { score } = req.body;

  try {
    await admin.database().ref(`/results/${league}`).push({ score, platform });

    return res.status(201).json({ message: 'Score submitted successfully' });
  } catch (error) {
    console.error(`POST /leagues/${league}/${platform} ({ score: ${score} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'Score rejected' });
  }
});

app.get('/functions/decklists/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const decklist = await admin.database().ref(`decklists/${id}`).once('value', data => data.val());
    if (!decklist) return res.status(404).json({ message: `Decklist: ${id} was not found.` });

    return res.status(200).json({ decklist });
  } catch (error) {
    console.error(`GET /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching decklist: ${id}.` });
  }
});

app.post('/functions/decklists/:id', async (req, res) => {
  const { id } = req.params;
  const { decklist } = req.body;

  try {
    await validateDecklist(decklist);
    await admin.database().ref(`/decklists/${id}`).update({ decklist });

    return res.status(201).json({ decklist });
  } catch (error) {
    console.error(`POST /decklists/${id} ({ decklist: decklist }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating decklist: ${id}.` });
  }
});

app.delete('/functions/decklists/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ref = await admin.database().ref(`/decklists/${id}`);

    const decklist = ref.once('value', data => data.val());
    ref.remove();

    return res.status(200).json({ decklist });
  } catch (error) {
    console.error(`DELETE /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting decklist: ${id}.` });
  }
});

async function validateDecklist(decklist) {
  /* https://scryfall.com/docs/api

    GET https://api.scryfall.com/cards/named?fuzzy=aust+com

    Get array of sets per card, checks each card for pre-WAR but also modern-legal
  */
  return true;
}

function enroll(name, decklist, platform) {
  /*
    Adds player and deck to league, fires if quota is met.
  */
}

exports.enroll = functions.database.ref('/decklists/{decklistID}').onCreate(snapshot => {
  const { name, decklist, platform } = snapshot.val();

  return enroll(name, decklist, platform);
});

exports.app = functions.https.onRequest(app);

/*
  POST /leagues/:platform
    name, decklist

   - validate decklist (throw on error)
   - send name and decklist (optional platform) to league ref
   - fire league if possible (generate league ID and pairings)
   - return 201

  POST /leagues/:league/:platform
    score

   - validate score
   - submit score and decklists to separate results ref
   - generate new pairings or end league if possible
   - return 201

  GET /decklists/:id

   - validate decklist
   - return 200 or infractions in 400

  POST /decklists/:id
    decklist

   - updates and validates decklist
   - returns 201 or infractions in 400

  DELETE /decklists/:id

   - deletes decklist
   - returns 200 with the affected decklist
  */
