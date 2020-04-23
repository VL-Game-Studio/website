const { Router } = require('express');
const { validateDecklist } = require('../utils');

const router = new Router();

router.post('/:platform', async (req, res) => {
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

router.post('/:league/:platform', async (req, res) => {
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

module.exports = router;
