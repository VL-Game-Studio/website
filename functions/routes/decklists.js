const { Router } = require('express');
const { decklists } = require('../persistence');
const { validateDecklist } = require('../utils');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allDecklists = await decklists.fetchAll();

    return res.status(200).json(allDecklists);
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

router.post('/', async (req, res) => {
  const { name, author, platform, mainboard, sideboard } = req.body;

  try {
    const deck = validateDecklist(mainboard, sideboard);
    const decklist = await decklists.create({ author, platform, ...deck });

    return res.status(201).json(decklist);
  } catch (error) {
    console.error(`POST /decklists ({ name: ${name}, author: ${author}, platform: ${platform}, mainboard: ${mainboard}, sideboad: ${sideboard} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while creating decklist.' });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, author, platform, mainboard, sideboard } = req.body;

  try {
    const deck = validateDecklist(mainboard, sideboard);
    const decklist = await decklists.update({ id, author, platform, ...deck });

    return res.status(201).json(decklist);
  } catch (error) {
    console.error(`POST /decklists/${id} ({ name: ${name}, author: ${author}, platform: ${platform}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating decklist: ${id}.` });
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
