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
    await admin.database()
      .ref(`/leagues/${id}`)
      .update(rest);

    return true;
  },
  async create(props) {
    const league = await admin.database()
      .ref('/leagues')
      .push(props)
      .then(snap => snap.val());

    return league;
  },
  async join({ id, author, ...rest }) {
    await admin.database()
      .ref(`/leagues/${id}/players/${author}`)
      .set({ author, ...rest });

    return true;
  },
  async report({ id, ...rest }) {
    await admin.database()
      .ref(`/leagues/${id}/results`)
      .push(rest);

    return true;
  },
  async fire(id) {
    await admin.database()
      .ref(`/leagues/${id}`)
      .set({ fired: true });

    return true;
  },
  async delete(id) {
    await admin.database()
      .ref(`/leagues/${id}`)
      .remove()
      .then(snap => snap.val());

    return null;
  },
};

module.exports = leagues;
