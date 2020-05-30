const { Router } = require('express');
const { events, decklists } = require('../persistence');
const { validateDecklist } = require('../utils');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allEvents = await events.fetchAll();

    return res.status(200).json(allEvents);
  } catch (error) {
    console.error(`GET /events >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching events.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const activeEvent = await events.fetch(id);
    if (!activeEvent) return res.status(404).json({ message: `An event could not be found for: ${id}.` });

    return res.status(200).json(activeEvent);
  } catch (error) {
    console.error(`GET /events/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching event: ${id}.` });
  }
});

router.post('/', async (req, res) => {
  const { name, platform, time, date, ...rest } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is a required field.' });
  if (!platform) return res.status(400).json({ error: 'Platform is a required field.' });
  if (!time) return res.status(400).json({ error: 'Time is a required field.' });
  if (!date) return res.status(400).json({ error: 'Date is a required field.' });

  try {
    const activeEvent = await events.create({ name, platform, time, date, ...rest });

    return res.status(200).json(activeEvent);
  } catch (error) {
    console.error(`POST /events/ ({ name: ${name}, platform: ${platform}, time: ${time}, date: ${date} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while creating event.' });
  }
});

router.post('/signup/:id', async (req, res) => {
  const { id } = req.params;

  const { player, username, deckID, mainboard, sideboard, ...rest } = req.body;
  if (!player) return res.status(400).json({ error: 'Player is a required field.' });
  if (!deckID && !mainboard) return res.status(400).json({ error: 'Deck is a required field, passed to either mainboard and sideboard or as a deckID.' });

  try {
    const activeEvent = await events.fetch(id);
    if (!activeEvent) return res.status(404).json({ message: `An event could not be found for: ${id}.` });

    if (deckID) {
      const playerReceipt = await events.signup({ id, player, username, deckID });

      return res.status(200).json(playerReceipt);
    } else {
      const deck = validateDecklist(mainboard, sideboard);
      const { id: deckID } = await decklists.create({ author: player, ...deck, ...rest });

      const playerReceipt = await events.signup({ id, player, username, deckID });

      return res.status(200).json(playerReceipt);
    }
  } catch (error) {
    console.error(`POST /events/ ({ player: ${player}, username: ${username}, deckID, ${deckID}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while signing up for event: ${id}.` });
  }
});

router.get('/pairings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const activeEvent = await events.fetch(id);
    if (!activeEvent) return res.status(404).json({ error: `An event could not be found for: ${id}.` });

    const pairings = await events.pairings(id);
    if (!pairings) return res.status(409).json({ error: 'There are not enough players to generate pairings.' });

    return res.status(200).json(pairings);
  } catch (error) {
    console.error(`POST /events/pairings/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured generating pairings for event: ${id}.` });
  }
});

router.post('/report/:id/:playerID', async (req, res) => {
  const { id, playerID } = req.params;
  const { result } = req.body;
  if (!result) return res.status(400).json({ error: 'Result is a required field.' });

  try {
    const activeEvent = await events.report({ id, playerID, result });
    if (!activeEvent) return res.status(400).json({ error: `You are not currently playing in event: ${id}.` });

    return res.status(200).json(activeEvent);
  } catch (error) {
    console.error(`POST /events/report/${id}/${playerID} ({ result: ${result} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while processing event result for player: ${playerID} in event: ${id}.` });
  }
});

router.get('/drop/:id/:playerID', async (req, res) => {
  const { id, playerID } = req.params;

  try {
    const activeEvent = await events.drop({ id, playerID });
    if (!activeEvent) return res.status(400).json({ error: `You are not currently playing in event: ${id}.` });

    return res.status(200).json(activeEvent);
  } catch (error) {
    console.error(`GET /events/drop/${id}/${playerID} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while dropping player: ${playerID} in event: ${id}.` });
  }
});

router.get('/fire/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const activeEvent = await events.fire(id);
    if (!activeEvent) return res.status(404).json({ error: `An event could not be found for: ${id}.` });

    return res.status(200).json(activeEvent);
  } catch (error) {
    console.error(`POST /events/fire/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while firing event: ${id}.` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const activeEvent = await events.delete(id);
    if (!activeEvent) return res.status(404).json({ message: `An event could not be found for: ${id}.` });

    return res.status(200).json(activeEvent);
  } catch (error) {
    console.error(`DELETE /events/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting event: ${id}.` });
  }
});

module.exports = router;
