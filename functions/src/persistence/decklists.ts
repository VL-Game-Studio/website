import { database } from 'firebase-admin'

const decklists = {
  async fetchAll() {
    const allDecklists = await database()
      .ref('/decklists')
      .once('value')
      .then(snap => snap.val())

    return allDecklists
  },
  async fetch(id: string) {
    const decklist = await database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val())

    return decklist
  },
  async update({ id, ...rest }) {
    await database().ref(`/decklists/${id}`).update(rest)

    const decklist = await database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val())

    return decklist
  },
  async create({ author, mainboard, sideboard, ...rest }) {
    const id = await database()
      .ref('/decklists')
      .push({ author, mainboard, sideboard, ...rest })
      .then(({ key }) => key)

    await database().ref(`/decklists/${id}`).update({ id })

    const decklist = await database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val())

    return decklist
  },
  async delete(id: string) {
    const decklist = await database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!decklist) return false

    await database().ref(`/decklists/${id}`).remove()

    return decklist
  },
}

export default decklists
