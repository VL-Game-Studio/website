//const fetch = require('node-fetch');
//const formatSets = require('../data/formatSets');

function validateDecklist(main, side) {
  const mainboard = main.includes('\n') ? main.split('\n') : main;
  const sideboard = side.includes('\n') ? side.split('\n') : side;

/*
  [mainboard, sideboard].map(async str => {
    const card = str.split(/ (.*)/)[1];
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${card.includes(' ') ? card.replace(' ', '+') : card}+unique%3Aprints`, {
      method: 'GET',
    });

    if (response.status !== 200) throw new Error('An error occured while contacting scryfall.');

    const { data } = response.json();
    const sets = data.map(({ set }) => set);
    formatSets(set => set.toLowerCase());
    if (!formatSets.some(sets)) throw new Error('Deck is not pre-WAR legal.');

    return str;
  });
*/

  return { mainboard, sideboard };
}

module.exports = validateDecklist;
