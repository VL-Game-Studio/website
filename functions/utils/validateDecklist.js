//const fetch = require('node-fetch');
//const formatSets = require('../data/formatSets');

function getSize(cards) {
  const quantities = cards.map(str => str.split(/ (.*)/)[0]);

  return quantities.reduce((a, b) => parseInt(a) + parseInt(b), 0);
}

function validateDecklist(main, side) {
  const mainboard = main.includes('\n') ? main.split('\n') : main;
  const sideboard = side.includes('\n') ? side.split('\n') : side;

  if (getSize(mainboard) < 60) throw new Error('Mainboard must consist of 60 cards!');
  if (getSize(sideboard) > 15) throw new Error('Sideboard must be fewer than 15 cards!');

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
