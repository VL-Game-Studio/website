const admin = require('firebase-admin');

async function getDeckById(id) {
  const deck = await admin.database()
    .ref(`/decklists/${id}`)
    .once('value', snap => {
      return { key: snap.key, ...snap.val() };
    }).then(({ mainboard, sideboard, ...rest }) => {
      return {
        mainboard: Object.values(mainboard),
        sideboard: Object.values(sideboard),
        ...rest
      };
    });

  return deck;
}

const decklists = {
  async fetchAll() {
    const allDecklists = await admin.database()
      .ref('/decklists')
      .once('value', snap => Object.values(snap.val()));

    return allDecklists;
  },
  async fetch(id) {
    const decklist = await getDeckById(id);

    return decklist;
  },
  async update({ id, ...rest }) {
    const key = await admin.database()
      .ref(`/decklists/${id}`)
      .update(rest)
      .then(({ key }) => key);

    const decklist = await getDeckById(key);

    return decklist;
  },
  async create(props) {
    const key = await admin.database()
      .ref('/decklists')
      .push(props)
      .then(({ key }) => key);

    const decklist = await getDeckById(key);

    return decklist;
  },
  async delete(id) {
    const decklist = await getDeckById(key);

    await admin.database()
      .ref(`/decklists/${id}`)
      .remove();

    return decklist;
  },
};

module.exports = decklists;
