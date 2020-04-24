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
    const key = await admin.database()
      .ref(`/leagues/${id}`)
      .update(rest)
      .then(({ key }) => key);

    const league = await admin.database()
      .ref(`/leagues/${key}`)
      .once('value', snap => snap.val());

    return league;
  },
  async create(props) {
    const key = await admin.database()
      .ref('/leagues')
      .push(props)
      .then(({ key }) => key);

    const league = await admin.database()
      .ref(`/leagues/${key}`)
      .once('value', snap => snap.val());

    return league;
  },
  async join({ id, author, ...rest }) {
    const key = await admin.database()
      .ref(`/leagues/${id}/players/${author}`)
      .set({ author, ...rest })
      .then(({ key }) => key);

    const league = await admin.database()
      .ref(`/leagues/${key}`)
      .once('value', snap => snap.val());

    return leauge;
  },
  async report({ id, ...rest }) {
    const key = await admin.database()
      .ref(`/leagues/${id}/results`)
      .push(rest)
      .then(({ key }) => key);

    const league = await admin.database()
      .ref(`/leagues/${key}`)
      .once('value', snap => snap.val());

    return league;
  },
  async fire(id) {
    const key = await admin.database()
      .ref(`/leagues/${id}`)
      .set({ fired: true })
      .then(({ key }) => key);

    const league = await admin.database()
      .ref(`/leagues/${key}`)
      .once('value', snap => snap.val());

    return league;
  },
  async delete(id) {
    const key = await admin.database()
      .ref(`/leagues/${id}`)
      .remove()
      .then(({ key }) => key);

    const league = await admin.database()
      .ref(`/leagues/${key}`)
      .once('value', snap => snap.val());

    return league;
  },
};

module.exports = leagues;
