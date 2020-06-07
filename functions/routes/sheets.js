const { Router } = require('express');
const { events } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const { id, platform, name, players, rounds } = await events.fetch('1590836400000');
    const playerCount = Object.values(players).length;

    const props = [id, platform, name, playerCount, rounds];
    const table = `<table><tr>${props.map(prop => `<td>${prop}</td>`).join('')}</tr></table>`;

    res.send(table);
  } catch (error) {
    console.error(`GET /sheets/events >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching events: ${error.message}.` });
  }
});

module.exports = router;
