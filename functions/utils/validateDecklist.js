async function validateDecklist({ mainboard: main, sideboard: side = '' }) {
  if (!main) throw new Error('Invalid deck. Mainboard is a required field.');

  const mainboard = main.split('\n').map(card => card);
  const sideboard = side.split('\n').map(card => card);

  return { mainboard, sideboard };
}

module.exports = validateDecklist;

/* https://scryfall.com/docs/api

  GET https://api.scryfall.com/cards/named?fuzzy=aust+com

  Get array of sets per card, checks each card for pre-WAR but also modern-legal
*/
