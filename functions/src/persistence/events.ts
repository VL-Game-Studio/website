import { database } from '.'
import { IEvent, IPlayer, ISignup } from '../types'

const events = {
  async fetchAll() {
    const allEvents: IEvent[] = await database
      .fetch('/events')

    return allEvents
  },
  async fetch(id: string) {
    const eventItem: IEvent = await database
      .fetch(`/events/${id}`)

    return eventItem
  },
  async create({ time, name, platform, ...rest }: IEvent) {
    time = new Date(time).getTime()
    const id = JSON.stringify(time)

    const eventExists: IEvent = await database
      .fetch(`/events/${id}`)
    if (eventExists) return false

    const eventItem: IEvent = await database
      .set(`/events/${id}`, {
        id,
        name,
        time,
        platform: platform ? platform.toUpperCase() : null,
        fired: false,
        ...rest,
      })

    return eventItem
  },
  async signup({
    id: eventID,
    player: playerID,
    username,
    name,
    mainboard,
    sideboard = []
  }: ISignup) {
    const activeEvent: IEvent = await database
      .fetch(`/events/${eventID}`)
    if (!activeEvent) throw new Error(`Event: ${eventID} does not exist.`)
    if (activeEvent?.fired) throw new Error(`Event: ${eventID} has already fired.`)

    const playerReceipt: IPlayer = await database
      .set(`/events/${eventID}/players/${playerID}}`, {
        id: playerID,
        username: activeEvent?.platform === 'PAPER' ? null : username,
        deck: {
          name,
          mainboard,
          sideboard,
        },
      })

    return playerReceipt
  },
  async update(props: any) {
    const { id } = props

    const eventItem: IEvent = await database
      .update(`/events/${id}`, props)

    return eventItem
  },
  async delete(id: string) {
    const eventItem: IEvent = await database
      .delete(`/events/${id}`)

    return eventItem
  },
}

export default events
