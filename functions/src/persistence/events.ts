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
  async create({
    time,
    name,
    platform,
    ...rest
  }: IEvent) {
    const eventItem: IEvent = await database
      .push('/events', {
        name,
        time: new Date(time).getTime(),
        platform: platform ? platform.toUpperCase() : null,
        fired: false,
        ...rest,
      })

    return eventItem
  },
  async signup({
    id,
    player,
    username,
    name,
    mainboard,
    sideboard = []
  }: ISignup) {
    const activeEvent: IEvent = await database
      .fetch(`/events/${id}`)
    if (!activeEvent) throw new Error(`Event: ${id} does not exist.`)
    if (activeEvent?.fired) throw new Error(`Event: ${id} has already fired.`)

    const playerReceipt: IPlayer = await database
      .set(`/events/${id}/players/${player}`, {
        id: player,
        username: activeEvent?.platform === 'PAPER' ? null : username,
        deck: {
          name,
          mainboard,
          sideboard,
        },
      })

    return playerReceipt
  },
  async update(props: IEvent) {
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
