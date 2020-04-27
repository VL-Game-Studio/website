const admin = require('firebase-admin');

const users = {
  async fetchAll() {
    const allUsers = await admin.database()
      .ref('/users')
      .once('value')
      .then(snap => snap.val());

    return allUsers;
  },
  async fetch(id) {
    const user = await admin.database()
      .ref(`/users/${id}`)
      .once('value')
      .then(snap => snap.val());

    return user;
  },
  async update({ id, ...rest }) {
    await admin.database()
      .ref(`/users/${id}`)
      .update(rest);

    const user = await admin.database()
      .ref(`/users/${id}`)
      .once('value')
      .then(snap => snap.val());

    return user;
  },
  async create(props) {
    const id = await admin.database()
      .ref('/users')
      .push(props)
      .then(({ key }) => key);

    await admin.database()
      .ref(`/users/${id}`)
      .update({ id });

    const user = await admin.database()
      .ref(`/users/${id}`)
      .once('value')
      .then(snap => snap.val());

    return user;
  },
  async delete(id) {
    const user = await admin.database()
      .ref(`/decklists/${id}`)
      .once('value')
      .then(snap => snap.val());

    await admin.database()
      .ref(`/decklists/${id}`)
      .remove();

    return user;
  },
};

module.exports = users;
