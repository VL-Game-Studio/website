function getSize(cards: string[]) {
  const quantities = cards.map(str => str.split(/ (.*)/)[0])

  return quantities.reduce((a, b) => a + parseInt(b), 0)
}

function validateDecklist(main: string, side: string) {
  const mainboard = main.includes('\n') ? main.split('\n') : [main]
  const sideboard = side ? (side[0] && side.includes('\n') ? side.split('\n') : [side]) : null

  if (getSize(mainboard) < 60) return 'Mainboard must consist of 60 cards!'
  if (sideboard && getSize(sideboard) > 15) return 'Sideboard must be fewer than 15 cards!'

  return { mainboard, sideboard }
}

export default validateDecklist
