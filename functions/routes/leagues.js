const { Router } = require('express');
const { leagues } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allLeagues = await leagues.fetchAll();

    return res.status(200).json(allLeagues);
  } catch (error) {
    console.error(`GET /leagues >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while fetching all league info.' });
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
  const { deckID, points, matches, opponents } = req.body;

  try {
    const league = await leagues.set({ id, deckID, points, matches, opponents });

    return res.status(201).json(league);
  } catch (error) {
    console.error(`POST /leagues/${id} ({ deckID: ${deckID}, points: ${points}, matches: ${matches}, opponents: ${opponents} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while processing league info for player: ${id}.` });
  }
});

router.get('/pair/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const opponent = await leagues.pair(id);

    return res.status(200).json(opponent);
  } catch (error) {
    console.error(`GET /leagues/pair/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while pairing player: ${id}.` });
  }
});

router.post('/report/:id', async (req, res) => {
  const { id } = req.params;
  const { result } = req.body;

  try {
    const league = await leagues.report({ id, result });

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
