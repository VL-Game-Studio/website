const { Router } = require('express');
const admin = require('firebase-admin');
const { validateDecklist } = require('../utils');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const leagues = await admin.database().ref('/leagues').once('value', snap => snap.val());

    return res.status(200).json(leagues);
  } catch (error) {
    console.error(`GET /leagues >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while fetching leagues.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const league = await admin.database().ref(`/leagues/${id}`).once('value', snap => snap.val());

    return res.status(200).json(league);
  } catch (error) {
    console.error(`GET /leagues/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching league: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, limit, platform } = req.body;

  try {
    const league = {
      id,
      name,
      limit,
      platform,
    };

    await admin.database().ref(`/leagues/${id}`).update(league);

    return res.status(200).json(league);
  } catch (error) {
    console.error(`POST /leagues/${id} ({ name: ${name}, limit: ${limit}, platform: ${platform} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating league: ${id}.` });
  }
});

router.post('/create', async (req, res) => {
  const { name, limit, platform } = req.body;

  try {
    const league = {
      name,
      limit,
      platform,
    };

    await admin.database().ref('/leagues').push(league);

    return res.status(201).json(league);
  } catch (error) {
    console.error(`POST /leagues/create ({ name: ${name}, limit: ${limit}, platform: ${platform} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while creating league: ${id}.` });
  }
});

router.post('/join/:id', async (req, res) => {
  const { id } = req.params;
  const { name, author, platform, decklist } = req.body;

  try {
    const { mainboard, sideboard } = await validateDecklist(decklist);
    const deck = {
      name,
      author,
      platform,
      mainboard,
      sideboard,
    };

    await admin.database().ref('/decklists').push(deck);

    return res.status(201).json(deck);
  } catch (error) {
    console.error(`POST /leagues/join/:id ({ name: ${name}, author: ${author}, platform: ${platform}, decklist: ${decklist} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while joining league: ${id}.` });
  }
});

router.get('/fire/:id', async (req, res) => {
  const { id } = req.params;

  try {
    //TODO: toggle league status and generate swiss pairings.
    return.res.status(200);
  } catch (error) {
    console.error(`GET /fire/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while firing league: ${id}.` });
  }
});

router.post('/results/:id', async (req, res) => {
  const { id } = req.params;
  const { result } = req.body;

  try {
    const { player1Wins, player2Wins, draws } = result;

    await admin.database().ref(`/results/${league}`).push({ player1Wins, player2Wins, draws });

    return res.status(201).json(result);
  } catch (error) {
    console.error(`POST /leagues/results/${league} ({ result: ${result} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while processing your match result.' });
  }
});

module.exports = router;
