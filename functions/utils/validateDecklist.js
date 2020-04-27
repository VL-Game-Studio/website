function getSize(cards) {
  const quantities = cards.map(str => str.split(/ (.*)/)[0]);

  return quantities.reduce((a, b) => parseInt(a) + parseInt(b), 0);
}

function validateDecklist(main, side) {
  const mainboard = main.includes('\n') ? main.split('\n') : [main];
  const sideboard = side.includes('\n') ? side.split('\n') : [side];

  if (getSize(mainboard) < 60) throw new Error('Mainboard must consist of 60 cards!');
  if (getSize(sideboard) > 15) throw new Error('Sideboard must be fewer than 15 cards!');

  return { mainboard, sideboard };
}

module.exports = validateDecklist;
