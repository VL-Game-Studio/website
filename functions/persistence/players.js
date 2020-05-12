const admin = require('firebase-admin');

const players = {
  async fetchAll() {
    const allPlayers = await admin.database()
      .ref('/players')
      .once('value')
      .then(snap => snap.val());

    return allPlayers;
  },
  async fetch(id) {
    const player = await admin.database()
      .ref(`/players/${id}`)
      .once('value')
      .then(snap => snap.val());

    return player;
  },
  async set({ id, ...props }) {
    await admin.database()
      .ref(`/players/${id}`)
      .set({ id, ...props });

    const player = await admin.database()
      .ref(`/players/${id}`)
      .once('value')
      .then(snap => snap.val());

    return player;
  },
  async delete(id) {
    const player = await admin.database()
      .ref(`/players/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (!player) return false;

    await admin.database()
      .ref(`/players/${id}`)
      .remove();

    return player;
  },
};

module.exports = players;
