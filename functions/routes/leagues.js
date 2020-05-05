const { Router } = require('express');
const { leagues, decklists } = require('../persistence');
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

router.get('/:id/players', async (req, res) => {
  const { id } = req.params;

  try {
    const players = await leagues.fetchPlayers(id);

    return res.status(200).json(players);
  } catch (error) {
    console.error(`GET /leagues/${id}/players >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching players from league: ${id}.` });
  }
});

router.get('/:id/players/:playerID', async (req, res) => {
  const { id, playerID } = req.params;

  try {
    const player = await leagues.fetchPlayer(id, playerID);
    if (!player) return res.status(404).json({ message: `Player: ${playerID} was not found.` });

    return res.status(200).json(player);
  } catch (error) {
    console.error(`GET /leagues/${id}/players/${playerID} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching player: ${playerID} from league: ${id}.` });
  }
});

router.delete('/:id/players/:playerID', async (req, res) => {
  const { id, playerID } = req.params;

  try {
    const player = await leagues.fetchPlayer(id, playerID);
    if (!player) return res.status(404).json({ message: `Player: ${playerID} was not found.` });

    return res.status(200).json(player);
  } catch (error) {
    console.error(`DELETE /leagues/${id}/players/${playerID} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting player: ${playerID} from league: ${id}.` });
  }
});

router.post('/', async (req, res) => {
  const { name, date, time, limit, platform } = req.body;

  try {
    const league = await leagues.create({ name, date, time, limit, platform });

    return res.status(201).json(league);
  } catch (error) {
    console.error(`POST /leagues/create ({ name: ${name}, date: ${date}, time: ${time}, limit: ${limit}, platform: ${platform} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while creating league: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, time, limit, platform } = req.body;

  try {
    const leauge = await leagues.update({ id, name, date, time, limit, platform });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`POST /leagues/${id} ({ name: ${name}, date: ${date}, time: ${time}, limit: ${limit}, platform: ${platform} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating league: ${id}.` });
  }
});

router.post('/join/:id', async (req, res) => {
  const { id } = req.params;
  const { name, username, deckID, mainboard, sideboard } = req.body;

  try {
    if (!deckID) {
      const deck = validateDecklist(mainboard, sideboard);
      const { id: decklistID } = await decklists.create({ author: name, ...deck });

      const league = await leagues.join({ id, name, username, deckID: decklistID });
      return res.status(201).json(league);
    }

    const league = await leagues.join({ id, name, username, deckID });

    return res.status(201).json(league);
  } catch (error) {
    console.error(`POST /leagues/join/${id} ({ name: ${name}, username: ${username}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while joining league: ${id}.` });
  }
});

router.get('/fire/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const league = await leagues.fire(id);

    return res.status(200).json(league);
  } catch (error) {
    console.error(`GET /fire/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while firing league: ${id}.` });
  }
});

router.post('/results/:id', async (req, res) => {
  const { id } = req.params;
  const { result, reportingPlayer } = req.body;

  try {
    if (!result.includes('-')) return res.status(400).json({ error: 'Invalid result format. Expected WINS-TIES-LOSSES.' });
    const results = await leagues.report({ id, result, reportingPlayer });
    if (!results) return res.status(403).json({ error: `Reporting player is not playing in event: ${id}.` });

    return res.status(201).json(results);
  } catch (error) {
    console.error(`POST /leagues/results/${league} ({ result: ${result} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while processing your match result.' });
  }
});

module.exports = router;
