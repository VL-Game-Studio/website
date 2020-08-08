import { database } from '../persistence'
import { ICard } from '../types'

interface IFormat {
  sets: string[]
  banned: string[]
  cards: ICard[]
}

/**
 * Filters card database to legal sets and removes banned cards
 */
async function getLegalCards() {
  // Fetches set and banlist data from format database
  const format: IFormat = await database
    .fetch('/format')
  if (!format) throw new Error('An error occured while validating card legality.')

  return format
}

export default getLegalCards
