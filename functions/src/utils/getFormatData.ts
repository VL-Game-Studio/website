import { database } from '../persistence'
import cards from '../data/cards.json'

interface IFormat {
  sets: string[]
  banned: string[]
}

/**
 * Filters card database to legal sets and removes banned cards
 */
async function getFormatData() {
  // Fetches set and banlist data from format database
  const format: IFormat = await database
    .fetch('/format')
  if (!format) throw new Error('An error occured while validating card legality.')

  return { cards, ...format }
}

export default getFormatData
