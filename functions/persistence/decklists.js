const admin = require('firebase-admin');

const decklists = {
  async fetchAll() {
    const allDecklists = await admin.database()
      .ref('/decklists')
      .once('value', snap => snap.val());

    return allDecklists;
  },
  async fetch(id) {
    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .once('value', snap => snap.val());

    return decklist;
  },
  async update({ id, ...rest }) {
    const key = await admin.database()
      .ref(`/decklists/${id}`)
      .update(rest)
      .then(({ key }) => key);

    const decklist = await admin.database()
      .ref(`/decklists/${key}`)
      .once('value', snap => snap.val());

    return decklist;
  },
  async create(props) {
    const key = await admin.database()
      .ref('/decklists')
      .push(props)
      .then(({ key }) => key);

    const decklist = await admin.database()
      .ref(`/decklists/${key}`)
      .once('value', snap => snap.val());

    return decklist;
  },
  async delete(id) {
    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .once('value', snap => snap.val());

    await admin.database()
      .ref(`/decklists/${id}`)
      .remove();

    return decklist;
  },
};

module.exports = decklists;
