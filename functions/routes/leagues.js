const { Router } = require('express');
const middleware = require('../middleware');
const { leagues, decklists } = require('../persistence');
const { validateDecklist } = require('../utils');

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

router.post('/:id', middleware, async (req, res) => {
  const { id } = req.params;

  try {
    const league = await leagues.create({ id, ...req.body });
    if (!league) return res.status(400).json({ error: `Player: ${id} is already in a league.` });

    return res.status(201).json(league);
  } catch (error) {
    console.error(`POST /leagues/${id} ({ body: ${req.body} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while creating league entry for: ${id}.` });
  }
});

router.get('/queue/:id', middleware, async (req, res) => {
  const { id } = req.params;

  try {
    const leagueExists = await leagues.fetch(id);
    if (!leagueExists) return res.status(404).json({ error: 'You are currently not in a league.' });

    const opponent = await leagues.pair(id);
    if (!opponent) return res.status(409).json({ error: `Could not find player to pair with: ${id}.` });

    return res.status(200).json(opponent);
  } catch (error) {
    console.error(`GET /leagues/queue/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while pairing player: ${id}.` });
  }
});

router.get('/queue/cancel/:id', middleware, async (req, res) => {
  const { id } = req.params;

  try {
    const leagueExists = await leagues.fetch(id);
    if (!leagueExists) return res.status(404).json({ error: 'You are currently not in a league.' });

    const league = await leagues.cancelPair(id);

    return res.status(200).json(league);
  } catch (error) {
    console.error(`GET /leagues/queue/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while pairing player: ${id}.` });
  }
});

router.post('/report/:id', middleware, async (req, res) => {
  const { id } = req.params;
  const { result } = req.body;
  if (!result) return res.status(400).json({ error: 'Result is a required field.' });

  try {
    const leagueExists = await leagues.fetch(id);
    if (!leagueExists) return res.status(404).json({ error: 'You are currently not in a league.' });

    const report = await leagues.report({ id, result });
    if (!report) return res.status(403).json({ error: 'You have not yet been paired for your league.' });

    return res.status(200).json(report);
  } catch (error) {
    console.error(`POST /leagues/report/${id} ({ result: ${result} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while processing league result for player: ${id}.` });
  }
});

router.delete('/:id', middleware, async (req, res) => {
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
