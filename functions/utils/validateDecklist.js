function getSize(cards) {
  const quantities = cards.map(str => str.split(/ (.*)/)[0]);

  return quantities.reduce((a, b) => parseInt(a) + parseInt(b), 0);
}

function validateDecklist(main, side) {
  const mainboard = main.includes('\n') ? main.split('\n') : [main];
  const sideboard = side ? side[0] && side.includes('\n') ? side.split('\n') : [side] : null;

  if (getSize(mainboard) < 60) throw new Error('Mainboard must consist of 60 cards!');
  if (sideboard && getSize(sideboard) > 15) throw new Error('Sideboard must be fewer than 15 cards!');

  return { mainboard, sideboard };
}

module.exports = validateDecklist;
