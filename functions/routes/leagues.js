const { Router } = require('express');
const { validateDecklist } = require('../utils');

const router = new Router();

router.post('/:platform', async (req, res) => {
  const { platform } = req.params;
  const { name, author, decklist } = req.body;

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
    console.error(`POST /leagues/${platform} ({ name: ${name}, author: ${author}, platform: ${platform}, decklist: ${decklist} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'Decklist rejected' });
  }
});

router.post('/:league/:platform', async (req, res) => {
  const { league, platform } = req.params;
  const { score } = req.body;

  try {
    const result = {
      league,
      platform,
      score,
    };

    await admin.database().ref(`/results/${league}`).push(result);

    return res.status(201).json(result);
  } catch (error) {
    console.error(`POST /leagues/${league}/${platform} ({ score: ${score} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while processing your match result.' });
  }
});

module.exports = router;
