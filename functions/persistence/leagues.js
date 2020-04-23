const admin = require('firebase-admin');

const leagues = {
  async fetchAll() {
    const allLeagues = await admin.database()
      .ref('/leagues')
      .once('value', snap => snap.val());

    return allLeagues;
  },
  async fetch(id) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    return league;
  },
  async update({ id, ...rest }) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .update(rest)
      .then(snap => snap.val());

    return league;
  },
  async create(props) {
    const league = await admin.database()
      .ref('/leagues')
      .push(props)
      .then(snap => snap.val());

    return league;
  },
  async join({ id, author, ...rest }) {
    const league = await admin.database()
      .ref(`/leagues/${id}/players/${author}`)
      .set({ author, ...rest })
      .then(snap => snap.val());

    return league;
  },
  async report({ id, ...rest }) {
    const league = await admin.database()
      .ref(`/leagues/${id}/results`)
      .push(rest)
      .then(snap => snap.val());

    return league;
  },
  async fire(id) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .set({ fired: true })
      .then(snap => snap.val());

    return league;
  },
  async delete(id) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .remove()
      .then(snap => snap.val());

    return league;
  },
};

module.exports = leagues;
