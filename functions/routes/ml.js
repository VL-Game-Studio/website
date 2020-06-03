const { Router } = require('express');
const { events } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const decks = await Object.values(events.fetchAll())
      .filter(({ players }) => players && players.deck)
      .map(({ players }) => players.deck);

    const decklists = decks.map(({ mainboard, sideboard = [] }) => {
      const quantities = [];
      const cards = [];

      [...mainboard, ...sideboard].forEach(str => {
        const [quantity, card] = str.split(/ (.*)/);

        quantities.push(parseInt(quantity));
        cards.push(card);
      });

      return { quantities, cards };
    });

    return res.status(200).json(decklists);
  } catch (error) {
    console.error(`GET /ml >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured. ${error.message}` });
  }
});

module.exports = router;
