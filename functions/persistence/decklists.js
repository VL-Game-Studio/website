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
    await admin.database()
      .ref(`/decklists/${id}`)
      .update(rest);

    return true;
  },
  async create(props) {
    await admin.database()
      .ref('/decklists')
      .push(props);

    return true;
  },
  async delete(id) {
    await admin.database()
      .ref(`/decklists/${id}`)
      .remove();

    return null;
  },
};

module.exports = decklists;
