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

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    return league;
  },
  async create(props) {
    const id = await admin.database()
      .ref('/leagues')
      .push(props)
      .then(({ key }) => key);

    await admin.database()
      .ref(`/leagues/${id}`)
      .set({ id });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    return league;
  },
  async join({ id, author, ...rest }) {
    await admin.database()
      .ref(`/leagues/${id}/players/${author}`)
      .set({ author, ...rest });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    return leauge;
  },
  async report({ id, ...rest }) {
    await admin.database()
      .ref(`/leagues/${id}/results`)
      .push(rest);

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    return league;
  },
  async fire(id) {
    await admin.database()
      .ref(`/leagues/${id}`)
      .set({ fired: true });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    return league;
  },
  async delete(id) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    await admin.database()
      .ref(`/leagues/${id}`)
      .remove();

    return league;
  },
};

module.exports = leagues;
