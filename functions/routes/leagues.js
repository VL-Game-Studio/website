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

router.get('/:format', async (req, res) => {
  const { format } = req.params;

  try {
    const allLeagues = await leagues.fetchAll(format);

    return res.status(200).json(allLeagues);
  } catch (error) {
    console.error(`GET /leagues/${format} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching all league info in ${format}.` });
  }
});

router.get('/:format/:platform', async (req, res) => {
  const { format, platform } = req.params;

  try {
    const allLeagues = await leagues.fetchAll(format, platform);

    return res.status(200).json(allLeagues);
  } catch (error) {
    console.error(`GET /leagues/${format}/${platform} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching all league info for ${platform} in ${format}.` });
  }
});

router.get('/:format/:platform/:id', async (req, res) => {
  const { format, platform, id } = req.params;

  try {
    const league = await leagues.fetch(format, platform, id);
    if (!league) return res.status(404).json({ error: `League info could not be found for player: ${id} from ${platform} in ${format}.` });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`GET /leagues/${format}/${platform}/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching league info for player: ${id} from ${platform} in ${format}.` });
  }
});

router.post('/:format/:platform/:id', async (req, res) => {
  const { format, platform, id } = req.params;
  const { deckID, ...rest } = req.body;
  if (!deckID) return res.status(400).json({ error: 'DeckID is a required field.' });

  try {
    const league = await leagues.set(format, platform, { id, deckID, ...rest });

    return res.status(201).json(league);
  } catch (error) {
    console.error(`POST /leagues/${format}/${platform}/${id} ({ deckID: ${deckID}, rest: ${rest} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while processing league info for player: ${id} from ${platform} in ${format}.` });
  }
});

router.get('/pair/:format/:platform/:id', async (req, res) => {
  const { format, platform, id } = req.params;

  try {
    const opponent = await leagues.pair(format, platform, id);
    if (!opponent) return res.status(409).json({ error: `Could not find player to pair with: ${id} from ${platform} in ${format}.` });

    return res.status(200).json(opponent);
  } catch (error) {
    console.error(`GET /leagues/pair/${format}/${platform}/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while pairing player: ${id} from ${platform} in ${format}.` });
  }
});

router.post('/report/:format/:platform/:id', async (req, res) => {
  const { format, platform, id } = req.params;
  const { result } = req.body;

  try {
    const league = await leagues.report(format, platform, { id, result });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`POST /leagues/report/${format}/${platform}/${id} ({ result: ${result} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while processing league result for player: ${id} from ${platform} in ${format}.` });
  }
});

router.delete('/:format/:platform/:id', async (req, res) => {
  const { format, platform, id } = req.params;

  try {
    const league = await leagues.delete(format, platform, id);
    if (!league) return res.status(404).json({ error: `League info could not be found for player: ${id} from ${platform} in ${format}.` });

    return res.status(200).json(league);
  } catch (error) {
    console.error(`DELETE /leagues/${format}/${platform}/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting league info for player: ${id} from ${platform} in ${format}.` });
  }
});

module.exports = router;
