const fetch = require('node-fetch');
const formatSets = require('../data/formatSets');

async function validateDecklist({ mainboard: main, sideboard: side = '' }) {
  if (!main) throw new Error('Invalid deck. Mainboard is a required field.');

  const mainboard = main.split('\n').map(card => card);
  const sideboard = side.split('\n').map(card => card);

  [mainboard, sideboard].forEach(async (str) => {
    const card = str.split(/ (.*)/);
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${card.replace(' ', '+')}+unique%3Aprints`, {
      method: 'GET',
    });

    if (response.status !== 200) throw new Error('An error occured while contacting scryfall.');

    const { data } = response.json();
    const sets = data.map(({ set }) => set);
    if (!formatSets.some(sets)) throw new Error('Deck is not pre-WAR legal.');
  });

  return { mainboard, sideboard };
}

module.exports = validateDecklist;
