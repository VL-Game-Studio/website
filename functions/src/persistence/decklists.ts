import { database } from '.'
import { IDecklist } from '../types'

const decklists = {
  async fetchAll() {
    const allDecklists: IDecklist[] = await database
      .fetch('/decklists')

    return allDecklists
  },
  async fetch(id: string) {
    const decklist: IDecklist = await database
      .fetch(`/decklists/${id}`)

    return decklist
  },
  async update({ id, ...props }: IDecklist) {
    const decklist: IDecklist = await database
      .update(`/decklists/${id}`, props)

    return decklist
  },
  async create(deck: IDecklist) {
    const decklist: IDecklist = await database
      .push('/decklists', deck)

    return decklist
  },
  async delete(id: string) {
    const decklist = await database
      .delete(`/decklists/${id}`)

    return decklist
  },
}

export default decklists
