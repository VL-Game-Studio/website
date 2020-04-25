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
  async create({ name, limit, platform }) {
    const id = await admin.database()
      .ref('/leagues')
      .push({ name, limit, platform })
      .then(({ key }) => key);

    await admin.database()
      .ref(`/leagues/${id}`)
      .update({ id });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value', snap => snap.val());

    return league;
  },
  async join({ id, name, username, deckID }) {
    await admin.database()
      .ref(`/leagues/${id}/players/${name.replace(/[^a-zA-Z ]/g, '')}`)
      .set({ name, username, deckID });

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
      .update({ fired: true });

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
