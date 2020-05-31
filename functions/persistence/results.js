const admin = require('firebase-admin');

const results = {
  async fetchAll() {
    const allResults = await admin.database()
      .ref('/results')
      .once('value')
      .then(snap => snap.val());

    return allResults;
  },
  async fetch(id) {
    const result = await admin.database()
      .ref(`/results/${id}`)
      .once('value')
      .then(snap => snap.val());

    return result;
  },
  async set(props) {
    const { id } = props;

    await admin.database()
      .ref(`/results/${id}`)
      .set(props);

    const result = await admin.database()
      .ref(`/results/${id}`)
      .once('value')
      .then(snap => snap.val());

    return result;
  },
  async delete(id) {
    const result = await admin.database()
      .ref(`/results/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (!result) return false;

    await admin.database()
      .ref(`/results/${id}`)
      .remove();

    return result;
  },
};

module.exports = results;
