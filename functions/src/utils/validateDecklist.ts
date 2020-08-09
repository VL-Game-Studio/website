import { getFormatData } from '.'
import basics from '../data/basics'
import cards from '../data/cards.json'

/**
 * Generates array of cards and applies aggressive regex
 * to format cards to '4 cardname'
 */
function getCardArray(str: string) {
  if (!str) return null

  // Replace white space with spaces
  str = str.replace(/\t/g, ' ')

  // Get array of cards per line
  const lines = str.includes('\n') ? str.split('\n') : [str]
  const data = lines.filter(Boolean).map(line => line.trim())

  // Reformat cards as 'quantity name'
  const cards = data.map(card => {
    const [quantity, name] = card.split(/ (.*)/)

    return `${quantity.replace(/\D/g,'')} ${name.toLowerCase()}`
  })

  return cards
}

/**
 * Calculates combined quantities of card pools
 */
function getSize(cards: string[]) {
  if (!cards) return false

  const quantities = cards.map(str => str.split(/ (.*)/)[0])

  return quantities.reduce((a, b) => a + parseInt(b), 0)
}

/**
 * Validates deck legality rules and normalizes card names
 */
async function checkCardLegality({ mainboard, sideboard }) {
  // Fetch list of legal cards and reduce their names into an array
  const { banned } = await getFormatData()
  const legalCards = cards && [...basics, ...cards?.map(({ name }) => name)]

  // Transform cardpool into lowercase pool for strict validation
  const lowerCaseCards = legalCards.map(card => card.toLowerCase())
  const bannedCards = banned.map(card => card.toLowerCase())

  // Apply format rules to mainboard and sideboard
  mainboard.concat(sideboard).filter(Boolean)?.forEach((card: string) => {
    const [quantity, name] = card.split(/ (.*)/)

    if (!basics.map(basic => basic.toLowerCase()).includes(name) && parseInt(quantity) > 4) throw new Error(`You can only have 4 of ${name}! Saw ${quantity}.`)
    if (lowerCaseCards && !lowerCaseCards.includes(name)) throw new Error(`Could not find a card for ${name}.`)
    if (bannedCards && bannedCards.includes(name)) throw new Error(`${name} is banned in Project Modern.`)
  })

  // Undo mainboard transformation
  mainboard = mainboard.map((card: string) => {
    const [quantity, name] = card.split(/ (.*)/)
    const cardName = legalCards.filter(entry => entry.toLowerCase() === name)[0]

    return `${quantity} ${cardName}`
  })

  // Undo sideboard transformation
  sideboard = sideboard ? sideboard.map((card: string) => {
    const [quantity, name] = card.split(/ (.*)/)
    const cardName = legalCards.filter(entry => entry.toLowerCase() === name)[0]

    return `${quantity} ${cardName}`
  }) : null

  return { mainboard, sideboard }
}

/**
 * Checks if a decklist is both valid input and follows
 * format rules
 */
async function validateDecklist(main: string, side?: string) {
  try {
    // Parse deck input as array
    const mainboard = getCardArray(main)
    const sideboard = getCardArray(side)

    // Validate base deck rules before strict checking
    if (getSize(mainboard) < 60) throw new Error('Mainboard must consist of at least 60 cards!')
    if (getSize(sideboard) > 15) throw new Error('Sideboard must be no more than 15 cards!')

    // Apply format rules and undo transformations
    const deck = await checkCardLegality({ mainboard, sideboard })

    return deck
  } catch (error) {
    console.error(`validateDecklist >> ${error.stack}`)
    return error.message
  }
}

export default validateDecklist
