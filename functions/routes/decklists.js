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
    return res.status(500).json({ error: `An error occured while fetching decklists.` });
  }
});

router.get('/ml', async (req, res) => {
  try {
    const ref = await decklists.fetchAll();

    const allDecklists = Object.values(ref).map(deck => {
      const { id, mainboard, sideboard } = deck;

      const quantities = [];
      const cards = [];

      [...mainboard, ...sideboard].forEach(str => {
        const [quantity, card] = str.split(/ (.*)/);

        quantities.push(parseInt(quantity));
        cards.push(card);
      });

      return { id, quantities, cards };
    });

    return res.status(200).json(allDecklists);
  } catch (error) {
    console.error(`GET /functions/ml >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured. ${error.message}` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const decklist = await decklists.fetch(id);
    if (!decklist) return res.status(404).json({ error: `Decklist: ${id} was not found.` });

    return res.status(200).json(decklist);
  } catch (error) {
    console.error(`GET /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching decklist: ${id}.` });
  }
});

router.post('/', async (req, res) => {
  const { author, mainboard, sideboard, ...rest } = req.body;
  if (!author) return res.status(400).json({ error: 'Author is a required field.' });
  if (!mainboard) return res.status(400).json({ error: 'Mainboard is a required field.' });

  try {
    const deck = validateDecklist(mainboard, sideboard);
    const decklist = await decklists.create({ author, ...deck, ...rest });

    return res.status(201).json(decklist);
  } catch (error) {
    console.error(`POST /decklists ({ author: ${author}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while creating decklist.' });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { author, mainboard, sideboard, ...rest } = req.body;

  try {
    const deck = validateDecklist(mainboard, sideboard);
    const decklist = await decklists.update({ id, author, ...deck, ...rest });

    return res.status(200).json(decklist);
  } catch (error) {
    console.error(`POST /decklists/${id} ({ author: ${author}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating decklist: ${id}.` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const decklist = await decklists.delete(id);
    if (!decklist) return res.status(404).json({ message: `Decklist: ${id} was not found.` });

    return res.status(200).json(decklist);
  } catch (error) {
    console.error(`DELETE /decklists/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting decklist: ${id}.` });
  }
});

module.exports = router;
