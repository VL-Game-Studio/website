const { Router } = require('express');
const { results } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allResults = await results.fetchAll();

    return res.status(200).json(allResults);
  } catch (error) {
    console.error(`GET /results >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching results.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await results.fetch(id);
    if (!result) return res.status(404).json({ message: `Results could not be found for: ${id}.` });

    return res.status(200).json(result);
  } catch (error) {
    console.error(`GET /results/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching result: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { deckID, matches } = req.body;

  try {
    const result = await results.set({ id, deckID, matches });

    return res.status(200).json(result);
  } catch (error) {
    console.error(`POST /results/${id} ({ deckID: ${deckID}, matches: ${matches} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating result: ${id}.` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await results.delete(id);
    if (!result) return res.status(404).json({ message: `Results could not be found for: ${id}.` });

    return res.status(200).json(result);
  } catch (error) {
    console.error(`DELETE /results/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting result: ${id}.` });
  }
});

module.exports = router;
