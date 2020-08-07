import { getLegalCards } from '.'
import basics from '../data/basics'

function getCardArray(str: string) {
  if (!str) return null
  if (!str?.includes('\n')) return [str]

  const lines = str.split('\n')
  const cards = lines.filter(line => line !== '\n')

  return cards
}

function getSize(cards: string[]) {
  if (!cards) return false

  const quantities = cards.map(str => str.split(/ (.*)/)[0])

  return quantities.reduce((a, b) => a + parseInt(b), 0)
}

async function checkCardLegality(cards: string[]) {
  const legalCards = await getLegalCards()
    .then(cards => cards && cards?.map(({ name }) => name))
    .then(cards => [...basics, ...cards])

  cards.forEach(card => {
    const [quantity, name] = card.split(/ (.*)/)
    if (!basics.includes(name) && parseInt(quantity) > 4) throw new Error(`You can only have 4 of ${name}! Saw ${quantity}.`)

    if (legalCards && !legalCards.includes(name)) throw new Error(`${name} is not legal in Project Modern.`)
  })
}

async function validateDecklist(main: string, side?: string) {
  try {
    const mainboard = getCardArray(main)
    const sideboard = getCardArray(side)

    if (getSize(mainboard) < 60) throw new Error('Mainboard must consist of at least 60 cards!')
    if (getSize(sideboard) > 15) throw new Error('Sideboard must be no more than 15 cards!')

    const cards = mainboard.concat(sideboard).filter(Boolean)
    await checkCardLegality(cards)

    return { mainboard, sideboard }
  } catch (error) {
    console.error(`validateDecklist >> ${error.stack}`)
    return error.message
  }
}

export default validateDecklist
