const { Router } = require('express');
const { players } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allPlayers = await players.fetchAll();

    return res.status(200).json(allPlayers);
  } catch (error) {
    console.error(`GET /players >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching players.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const player = await players.fetch(id);
    if (!player) return res.status(404).json({ error: `Player: ${id} was not found.` });

    return res.status(200).json(player);
  } catch (error) {
    console.error(`GET /players/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching player: ${id}.` });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, platforms } = req.body;

  try {
    const player = await players.set({ id, name, platforms });

    return res.status(200).json(player);
  } catch (error) {
    console.error(`POST /players/${id} ({ name: ${name}, platforms: ${platforms} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while processing player: ${id}.` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const player = await players.delete(id);
    if (!player) return res.status(404).json({ error: `Player: ${id} was not found.` });

    return res.status(200).json(player);
  } catch (error) {
    console.error(`DELETE /players/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting player: ${id}.` });
  }
});

module.exports = router;
