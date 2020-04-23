const { Router } = require('express');
const { decklists } = require('../persistence');
const { validateDecklist } = require('../utils');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allDecklists = await decklists.fetchAll();

    return res.status(200).json(decklists);
  } catch (error) {
    console.error(`GET /decklists >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching deckists.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const decklist = await decklists.fetch(id);
    if (!decklist) return res.status(404).json({ message: `Decklist: ${id} was not found.` });

    return res.status(200).json(decklist);
  } catch (error) {
    console.error(`GET /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching decklist: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, author, platform, deck } = req.body;

  try {
    const { mainboard, sideboard } = await validateDecklist(deck);
    const decklist = await decklists.update({ id, author, platform, mainboard, sideboard });

    return res.status(201).json(decklist);
  } catch (error) {
    console.error(`POST /decklists/${id} ({ name: ${name}, author: ${author}, platform: ${platform}, deck: ${deck} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating decklist: ${id}.` });
  }
});

router.post('/create', async (req, res) => {
  const { name, author, platform, deck } = req.body;

  try {
    const { mainboard, sideboard } = await validateDecklist(deck);
    const decklist = await decklists.create({ author, platform, mainboard, sideboard });

    return res.status(201).json(decklist);
  } catch (error) {
    console.error(`POST /decklists/create ({ name: ${name}, author: ${author}, platform: ${platform}, deck: ${deck} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while creating decklist.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const decklist = await decklists.remove(id);

    return res.status(200).json(decklist);
  } catch (error) {
    console.error(`DELETE /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting decklist: ${id}.` });
  }
});

module.exports = router;
