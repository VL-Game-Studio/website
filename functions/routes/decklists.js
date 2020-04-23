const { Router } = require('express');
const { validateDecklist } = require('../utils');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const decklists = await admin.database().ref('/decklists').once('value', data => data.val());

    return res.status(200).json(decklists);
  } catch (error) {
    console.erorr(`GET /decklists >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching deckists.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const decklist = await admin.database().ref(`decklists/${id}`).once('value', data => data.val());
    if (!decklist) return res.status(404).json({ message: `Decklist: ${id} was not found.` });

    return res.status(200).json(decklist);
  } catch (error) {
    console.error(`GET /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching decklist: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
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

    await admin.database().ref(`/decklists/${id}`).update(deck);

    return res.status(201).json(decklist);
  } catch (error) {
    console.error(`POST /decklists/${id} ({ decklist: decklist }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating decklist: ${id}.` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ref = await admin.database().ref(`/decklists/${id}`);

    const decklist = ref.once('value', data => data.val());
    ref.remove();

    return res.status(200).json(decklist);
  } catch (error) {
    console.error(`DELETE /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting decklist: ${id}.` });
  }
});

module.exports = router;
