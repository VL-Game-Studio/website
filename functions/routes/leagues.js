const { Router } = require('express');
const { leagues } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allLeagues = await leagues.fetchAll();

    return res.status(200).json(allLeagues);
  } catch (error) {
    console.error(`GET /leagues >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching all league info.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const league = await leagues.fetch(id);
    if (!league) return res.status(404).json({ error: `League info could not be found for player: ${id}.` });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`GET /leagues/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching league info for player: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { deckID, format, platform, ...rest } = req.body;
  if (!deckID) return res.status(400).json({ error: 'DeckID is a required field.' });
  if (!format) return res.status(400).json({ error: 'Format is a required field.' });
  if (!platform) return res.status(400).json({ error: 'Platform is a required field.' });

  try {
    const league = await leagues.set({
      id,
      format,
      platform,
      deckID,
      ...rest
    });

    return res.status(201).json(league);
  } catch (error) {
    console.error(`POST /leagues/${id} ({ deckID: ${deckID}, rest: ${rest} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while creating league entry for: ${id}.` });
  }
});

router.get('/pair/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const opponent = await leagues.pair(id);
    if (!opponent) return res.status(409).json({ error: `Could not find player to pair with: ${id}.` });

    return res.status(200).json(opponent);
  } catch (error) {
    console.error(`GET /leagues/pair/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while pairing player: ${id}.` });
  }
});

router.post('/report/:id', async (req, res) => {
  const { id } = req.params;
  const { result } = req.body;
  if (!result) return res.status(400).json({ error: 'Result is a required field.' });

  try {
    const league = await leagues.report({ id, result });
    if (!league) return res.status(400).json({ error: 'You are currently not in a league.' });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`POST /leagues/report/${id} ({ result: ${result} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while processing league result for player: ${id}.` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const league = await leagues.delete(id);
    if (!league) return res.status(404).json({ error: `League info could not be found for player: ${id}.` });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`DELETE /leagues/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting league info for player: ${id}.` });
  }
});

module.exports = router;
