const admin = require('firebase-admin');

const decklists = {
  async fetchAll() {
    const allDecklists = await admin.database()
      .ref('/decklists')
      .once('value')
      .then(snap => snap.val());

    return allDecklists;
  },
  async fetch(id) {
    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val());

    return decklist;
  },
  async update({ id, ...rest }) {
    await admin.database()
      .ref(`/decklists/${id}`)
      .update(rest);

    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val());

    return decklist;
  },
  async create(props) {
    const id = await admin.database()
      .ref('/decklists')
      .push(props)
      .then(({ key }) => key);

    await admin.database()
      .ref(`/decklists/${id}`)
      .update({ id });

    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val());

    return decklist;
  },
  async delete(id) {
    const decklist = await admin.database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val());

    await admin.database()
      .ref(`/decklists/${id}`)
      .remove();

    return decklist;
  },
};

module.exports = decklists;
