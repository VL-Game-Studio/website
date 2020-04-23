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
    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .update(rest)
      .then(snap => snap.val());

    return decklist;
  },
  async create(props) {
    const decklist = await admin.database()
      .ref('/decklists')
      .push(props)
      .then(snap => snap.val());

    return decklist;
  },
  async delete(id) {
    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .remove()
      .then(snap => snap.val());

    return decklist;
  },
};

module.exports = decklists;
