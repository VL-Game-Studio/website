const { Router } = require('express');
const { leagues } = require('../persistence');
const { validateDecklist } = require('../utils');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allLeagues = await leagues.fetchAll();

    return res.status(200).json(allLeagues);
  } catch (error) {
    console.error(`GET /leagues >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while fetching leagues.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const league = await leagues.fetch(id);
    if (!league) return res.status(404).json({ message: `League: ${id} was not found.` });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`GET /leagues/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching league: ${id}.` });
  }
});

router.post('/', async (req, res) => {
  const { name, limit, platform } = req.body;

  try {
    await leagues.create({ name, limit, platform });

    return res.status(201).json({ message: 'League was successfully created.' });
  } catch (error) {
    console.error(`POST /leagues/create ({ name: ${name}, limit: ${limit}, platform: ${platform} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while creating league: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, limit, platform } = req.body;

  try {
    await leagues.update({ id, name, limit, platform });

    return res.status(200).json({ message: `League: ${id} was successfully updated.` });
  } catch (error) {
    console.error(`POST /leagues/${id} ({ name: ${name}, limit: ${limit}, platform: ${platform} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating league: ${id}.` });
  }
});

router.post('/join/:id', async (req, res) => {
  const { id } = req.params;
  const { name, author, platform, mainboard, sideboard } = req.body;

  try {
    const deck = validateDecklist(mainboard, sideboard);
    await leagues.join({ id, author, platform, ...deck });

    return res.status(201).json({ message: `You successfully joined league: ${id}.` });
  } catch (error) {
    console.error(`POST /leagues/join/:id ({ name: ${name}, author: ${author}, platform: ${platform}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while joining league: ${id}.` });
  }
});

router.get('/fire/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await leagues.fire(id);

    return res.status(200).json({ message: `League: ${id} was successfully fired.` });
  } catch (error) {
    console.error(`GET /fire/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while firing league: ${id}.` });
  }
});

router.post('/results/:id', async (req, res) => {
  const { id } = req.params;
  const { result } = req.body;

  try {
    await leagues.report({ id, ...result });

    return res.status(201).json({ message: `Successfully recorded results for league: ${id}.` });
  } catch (error) {
    console.error(`POST /leagues/results/${league} ({ result: ${result} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while processing your match result.' });
  }
});

module.exports = router;
