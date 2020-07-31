import { database } from 'firebase-admin'
import { IEvent, IPlayer, ISignup } from '../types'

const events = {
  async fetchAll() {
    const allEvents: IEvent[] = await database()
      .ref('/events')
      .once('value')
      .then(snap => snap.val())

    return allEvents
  },
  async fetch(id: string) {
    const eventItem: IEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

    return eventItem
  },
  async create({ time, name, platform, ...rest }: IEvent) {
    time = new Date(time).getTime()
    const id = JSON.stringify(time)

    const eventExists: IEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (eventExists) return false

    await database()
      .ref(`/events/${id}`)
      .set({
        id,
        name,
        time,
        platform: platform ? platform.toUpperCase() : null,
        fired: false,
        ...rest,
      })

    const eventItem: IEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

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
    const activeEvent: IEvent = await database()
      .ref(`/events/${eventID}`)
      .once('value')
      .then(snap => snap.val())
    if (!activeEvent) throw new Error(`Event: ${eventID} does not exist.`)
    if (activeEvent.fired) throw new Error(`Event: ${eventID} has already fired.`)

    await database()
      .ref(`/events/${eventID}/players/${playerID}`)
      .set({
        id: playerID,
        username: activeEvent.platform === 'PAPER' ? null : username,
        deck: {
          name,
          mainboard,
          sideboard,
        },
      })

    const playerReceipt: IPlayer = await database()
      .ref(`/events/${eventID}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val())

    return playerReceipt
  },
  async update({ id, ...props }) {
    const activeEvent: IEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!activeEvent) return false

    await database().ref(`/events/${id}`).update(props)

    const eventReceipt: IEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

    return eventReceipt
  },
  async delete(id: string) {
    const eventItem: IEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!eventItem) return false

    await database().ref(`/events/${id}`).remove()

    return eventItem
  },
}

export default events
